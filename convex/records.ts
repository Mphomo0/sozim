import { query, mutation, internalMutation, internalQuery, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// --- Queries ---

export const getRecords = query({
  args: {
    category: v.optional(v.string()),
    query: v.optional(v.string()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
    filters: v.optional(v.object({
      year: v.optional(v.string()),
      repository: v.optional(v.string()),
      type: v.optional(v.string()),
      author: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Normalise category alias
    const normCat = args.category === 'theses' ? 'thesis'
      : args.category === 'articles' ? 'article'
      : args.category === 'research' ? 'research'
      : args.category;

    // Apply category filter at the DB level when possible to reduce payload
    let baseRecords =
      normCat && normCat !== 'all'
        ? await ctx.db.query('records').withIndex('by_category', q => q.eq('category', normCat)).collect()
        : await ctx.db.query('records').collect();

    let filtered = baseRecords;

    if (args.filters) {
      const { year: fYear, repository: fRepo, type: fType, author: fAuthor } = args.filters;

      if (fYear) {
        const y = parseInt(fYear);
        filtered = filtered.filter(r => r.year === y);
      }
      if (fRepo) {
        filtered = filtered.filter(r => r.source === fRepo);
      }
      if (fType) {
        filtered = filtered.filter(r => r.type === fType);
      }
      if (fAuthor) {
        const auth = fAuthor.toLowerCase();
        filtered = filtered.filter(r => r.authors.some(a => a.toLowerCase().includes(auth)));
      }
    }

    if (args.query) {
      const q = args.query.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        r.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const page = args.page || 1;
    const pageSize = args.pageSize || 24;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    // Build facets from the already-filtered base set (not repulled from DB)
    const allAuthors = baseRecords.flatMap(r => r.authors || []);
    const uniqueAuthors = Array.from(new Set(allAuthors));
    const facets = {
      years: Array.from(new Set(baseRecords.map(r => r.year).filter(y => y !== undefined)))
        .sort((a, b) => (b || 0) - (a || 0))
        .map(y => ({ name: y, count: baseRecords.filter(r => r.year === y).length })),
      authors: uniqueAuthors.slice(0, 50).map(a => ({ name: a, count: allAuthors.filter(auth => auth === a).length })),
      repositories: Array.from(new Set(baseRecords.map(r => r.source))).sort().map(s => ({ name: s, count: baseRecords.filter(r => r.source === s).length })),
      types: Array.from(new Set(baseRecords.map(r => r.type))).sort().map(t => ({ name: t, count: baseRecords.filter(r => r.type === t).length })),
      categories: Array.from(new Set(baseRecords.map(r => r.category))).sort().map(c => ({ name: c, count: baseRecords.filter(r => r.category === c).length })),
    };

    return {
      results,
      total,
      page,
      pageSize,
      hasMore: start + pageSize < total,
      facets,
    };
  },
});

// Efficient category counts — uses indexes to avoid full table scan
export const countByCategory = query({
  args: {},
  handler: async (ctx) => {
    const theses = await ctx.db.query('records').withIndex('by_category', q => q.eq('category', 'thesis')).collect();
    const articles = await ctx.db.query('records').withIndex('by_category', q => q.eq('category', 'article')).collect();
    const research = await ctx.db.query('records').withIndex('by_category', q => q.eq('category', 'research')).collect();
    
    return {
      thesis: theses.length,
      article: articles.length,
      research: research.length,
      total: theses.length + articles.length + research.length,
    };
  },
});

export const getLibraryMeta = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("libraryMeta")
      .withIndex("by_key", q => q.eq("key", args.key))
      .first();
  },
});

// --- Mutations ---

export const bulkUpsertRecords = mutation({
  args: {
    records: v.array(v.object({
      id: v.string(),
      title: v.string(),
      authors: v.array(v.string()),
      description: v.optional(v.string()),
      keywords: v.array(v.string()),
      year: v.optional(v.number()),
      source: v.string(),
      type: v.string(),
      identifier: v.optional(v.string()),
      identifierType: v.optional(v.string()),
      url: v.optional(v.string()),
      category: v.string(),
    })),
    clearCategory: v.optional(v.string()), // Optionally clear a category before inserting
  },
  handler: async (ctx, args) => {
    const importDate = Date.now();

    if (args.clearCategory) {
      const existing = await ctx.db.query("records")
        .withIndex("by_category", q => q.eq("category", args.clearCategory!))
        .collect();
      for (const r of existing) {
        await ctx.db.delete(r._id);
      }
    }

    let inserted = 0;
    for (const rec of args.records) {
      if (args.clearCategory) {
        // Category was just wiped above — no duplicates possible, always insert.
        await ctx.db.insert("records", { ...rec, importDate });
        inserted++;
      } else {
        // No clear: check for existing record by our custom ID to avoid duplicates.
        const existing = await ctx.db.query("records")
          .withIndex("by_record_id", q => q.eq("id", rec.id))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, { ...rec, importDate });
        } else {
          await ctx.db.insert("records", { ...rec, importDate });
          inserted++;
        }
      }
    }

    return inserted;
  },
});

export const updateLibraryMeta = mutation({
  args: {
    key: v.string(),
    counts: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
      total: v.number(),
    }),
    lastHarvest: v.optional(v.number()),
    lastError: v.optional(v.object({
      context: v.string(),
      message: v.string(),
      time: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("libraryMeta")
      .withIndex("by_key", q => q.eq("key", args.key))
      .first();

    const data = {
      ...args,
      lastUpdated: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("libraryMeta", data);
    }
  },
});

export const harvestFull = action({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; message: string; jobId: string }> => {
    try {
      const repoIds = Object.keys({
        uct: 'https://open.uct.ac.za/oai/request',
        spu: 'https://openhub.spu.ac.za/oai/request',
        sun: 'https://scholar.sun.ac.za/server/oai/request',
        ufs: 'https://scholar.ufs.ac.za/server/oai/request',
        up: 'https://repository.up.ac.za/server/oai/request',
        unisa: 'https://uir.unisa.ac.za/server/oai/request',
        nwu: 'https://repository.nwu.ac.za/server/oai/request',
        wits: 'https://wiredspace.wits.ac.za/server/oai/request',
        cut: 'https://cutscholar.cut.ac.za/server/oai/request',
      });

      const totalRepos = repoIds.length + 1;

      const jobId = await ctx.runMutation(internal.harvestJobs.createHarvestJobInternal, {
        type: "full",
        totalRepos,
      });

      await ctx.runAction(internal.harvest.runDailyHarvest);

      return {
        success: true,
        message: 'Full harvest initiated',
        jobId,
      };
    } catch (error) {
      console.error('Full harvest error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Full harvest failed',
        jobId: '',
      };
    }
  },
});

export const harvestIncremental = action({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; message: string; jobId: string }> => {
    try {
      const repoIds = Object.keys({
        uct: 'https://open.uct.ac.za/oai/request',
        spu: 'https://openhub.spu.ac.za/oai/request',
        sun: 'https://scholar.sun.ac.za/server/oai/request',
        ufs: 'https://scholar.ufs.ac.za/server/oai/request',
        up: 'https://repository.up.ac.za/server/oai/request',
        unisa: 'https://uir.unisa.ac.za/server/oai/request',
        nwu: 'https://repository.nwu.ac.za/server/oai/request',
        wits: 'https://wiredspace.wits.ac.za/server/oai/request',
        cut: 'https://cutscholar.cut.ac.za/server/oai/request',
      });

      const totalRepos = repoIds.length + 1;

      const jobId = await ctx.runMutation(internal.harvestJobs.createHarvestJobInternal, {
        type: "incremental",
        totalRepos,
      });

      await ctx.runAction(internal.harvest.runDailyHarvest);

      return {
        success: true,
        message: 'Incremental harvest initiated',
        jobId,
      };
    } catch (error) {
      console.error('Incremental harvest error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Incremental harvest failed',
        jobId: '',
      };
    }
  },
});

export const searchElis = query({
  args: {
    query: v.string(),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ results: any[]; endpointUsed: string | null }> => {
    const ELIS_PRIMARY = 'http://eprints.rclis.org/cgi/oai2';
    const PAGE_SIZE_DEFAULT = 24;

    const pageSize = args.pageSize || PAGE_SIZE_DEFAULT;
    const limitTotal = (args.page || 1) * pageSize;
    const maxPages = 3;

    async function fetchWithRetry(url: string, retries = 2): Promise<string | null> {
      let attempt = 0;
      while (attempt <= retries) {
        try {
          const res = await fetch(url, {
            headers: {
              'User-Agent': 'Academic-Library-Harvester/3.4.0',
              Accept: 'application/xml,text/xml',
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.text();
        } catch {
          attempt++;
          if (attempt > retries) return null;
        }
      }
      return null;
    }

    function extract(xml: string, tag: string): string[] {
      const out: string[] = [];
      if (!xml || !tag) return out;
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`<${escapedTag}>([\\s\\S]*?)<\\/${escapedTag}>`, 'gi');
      let m: RegExpExecArray | null;
      while ((m = re.exec(xml))) {
        const content = m[1].trim();
        if (content) {
          out.push(content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim());
        }
      }
      return out;
    }

    function parseOaiRecords(xml: string): { records: any[]; next: string | null } {
      const recs: any[] = [];
      const next = xml.match(/<resumptionToken[^>]*>([\s\S]*?)<\/resumptionToken>/i)?.[1]?.trim() || null;
      
      const recRegex = /<record>[\s\S]*?<\/record>/gi;
      let m: RegExpExecArray | null;
      while ((m = recRegex.exec(xml))) {
        const block = m[0];
        const title = extract(block, 'dc:title')[0] || extract(block, 'dc.title')[0] || 'Untitled';
        const creators = extract(block, 'dc:creator').concat(extract(block, 'dc.creator'));
        const desc = extract(block, 'dc:description')[0] || extract(block, 'dc.description')[0] || '';
        const subjects = extract(block, 'dc:subject').concat(extract(block, 'dc.subject'));
        const types = extract(block, 'dc:type').concat(extract(block, 'dc.type')).join(' ').toLowerCase();
        const date = extract(block, 'dc:date')[0] || extract(block, 'dc.date')[0] || '';
        const identifiers = extract(block, 'dc:identifier').concat(extract(block, 'dc.identifier'));
        const url = identifiers.find((u: string) => /^https?:\/\/\S+\.\S{2,}/i.test(u)) || identifiers[0] || '';
        
        let type = 'Other';
        if (/(thesis|dissertation)/i.test(types)) type = 'Thesis/Dissertation';
        else if (/article/i.test(types)) type = 'Journal Article';

        const yearMatch = date.match(/\b(\d{4})\b/);
        const year = yearMatch ? parseInt(yearMatch[1]) : undefined;

        recs.push({
          id: `elis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title,
          authors: creators,
          description: desc,
          keywords: subjects,
          year,
          source: 'E-LIS e-prints in Library and Information Science',
          type,
          identifier: url.split('/').pop() || url,
          identifierType: url.includes('doi.org') ? 'DOI' : 'ID',
          url,
        });
      }
      return { records: recs, next };
    }

    function parseSearchQuery(q: string): { phrases: string[]; tokens: string[] } {
      const text = q.toLowerCase().trim();
      const phrases: string[] = [];
      const tokens: string[] = [];
      const re = /"([^"]+)"|(\S+)/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        if (m[1]) phrases.push(m[1].trim());
        else if (m[2]) tokens.push(m[2].trim());
      }
      return { phrases, tokens };
    }

    function matchesQuery(record: any, parsed: { phrases: string[]; tokens: string[] }): boolean {
      const haystack = `${record.title || ''} ${record.description || ''} ${(record.keywords || []).join(' ')} ${(record.authors || []).join(' ')}`.toLowerCase();
      for (const p of parsed.phrases) {
        if (!haystack.includes(p)) return false;
      }
      for (const t of parsed.tokens) {
        if (!haystack.includes(t)) return false;
      }
      return true;
    }

    try {
      const testUrl = `${ELIS_PRIMARY}?verb=ListRecords&metadataPrefix=oai_dc`;
      const testXml = await fetchWithRetry(testUrl);
      if (!testXml || !testXml.includes('<record>')) {
        return { results: [], endpointUsed: null };
      }

      const parsed = parseSearchQuery(args.query);
      const allMatches: any[] = [];
      let token: string | null = null;
      let pages = 0;

      while (allMatches.length < limitTotal && pages < maxPages) {
        const searchUrl = token
          ? `${ELIS_PRIMARY}?verb=ListRecords&resumptionToken=${encodeURIComponent(token)}`
          : `${ELIS_PRIMARY}?verb=ListRecords&metadataPrefix=oai_dc`;

        const xml = await fetchWithRetry(searchUrl);
        if (!xml || xml.length < 200) break;

        if (xml.includes('<error code=')) {
          const errorMatch = xml.match(/<error code="([^"]*)">([^<]*)<\/error>/);
          if (errorMatch && errorMatch[1] === 'noRecordsMatch') break;
        }

        const { records, next } = parseOaiRecords(xml);
        for (const record of records) {
          if (matchesQuery(record, parsed)) {
            allMatches.push(record);
            if (allMatches.length >= limitTotal) break;
          }
        }

        token = next;
        pages++;
        if (!token) break;
      }

      const offset = ((args.page || 1) - 1) * pageSize;
      const slice = allMatches.slice(offset, offset + pageSize);
      return { results: slice, endpointUsed: 'primary' };
    } catch (err) {
      console.error('E-LIS search error:', (err as Error).message);
      return { results: [], endpointUsed: null };
    }
  },
});

export const searchResearchLive = query({
  args: {
    query: v.string(),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ records: any[]; total: number; hasMore: boolean }> => {
    const PAGE_SIZE_DEFAULT = 24;
    const perPage = Math.min(args.pageSize || PAGE_SIZE_DEFAULT, 50);
    const trimmed = args.query.trim();
    const page = args.page || 1;

    if (!trimmed) {
      return { records: [], total: 0, hasMore: false };
    }

    async function fetchJSON<T = any>(url: string): Promise<T | null> {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Academic-Library-Harvester/3.4.0',
            Accept: 'application/json',
          },
        });
        if (!res.ok) return null;
        return await res.json() as T;
      } catch {
        return null;
      }
    }

    function stripHtml(s: string): string {
      return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }

    function year(d?: string | number): number | undefined {
      if (!d) return undefined;
      const match = String(d).match(/\b(\d{4})\b/);
      return match ? parseInt(match[1]) : undefined;
    }

    function detectDryad(identifier: string = '', url: string = ''): boolean {
      const id = identifier.toLowerCase();
      const u = url.toLowerCase();
      return id.startsWith('10.5061/') || id.startsWith('10.6071/') || u.includes('datadryad.org');
    }

    function detectZenodo(identifier: string = '', url: string = ''): boolean {
      const id = identifier.toLowerCase();
      const u = url.toLowerCase();
      return id.startsWith('10.5281/') || id.includes('zenodo') || u.includes('zenodo.org');
    }

    function detectMendeley(identifier: string = '', url: string = ''): boolean {
      const id = identifier.toLowerCase();
      const u = url.toLowerCase();
      return id.startsWith('10.17632/') || u.includes('data.mendeley.com');
    }

    const openAlexUrl = `https://api.openalex.org/works?filter=type:dataset,title.search:${encodeURIComponent(trimmed)}&per-page=${perPage}&page=${page}`;
    const data = await fetchJSON<{ results?: any[]; meta?: { count?: number; next_cursor?: string } }>(openAlexUrl);

    if (!data || !Array.isArray(data.results)) {
      return { records: [], total: 0, hasMore: false };
    }

    const lowerQuery = trimmed.toLowerCase();
    const tokens = trimmed.toLowerCase().split(/\s+/).filter(Boolean);

    const mapped: any[] = [];
    for (const it of data.results) {
      try {
        const doiRaw = it.doi || '';
        const doi = doiRaw.replace(/^https?:\/\/doi.org\//i, '').trim();
        const title = it.display_name || 'Untitled';
        const pubYear = year(it.publication_year);

        const auths = it.authorships || [];
        const authors = auths.map((a: any) => a.author?.display_name || '').filter(Boolean);

        const concepts = (it.concepts || []).map((c: any) => c.display_name || '').filter(Boolean);
        const conceptString = concepts.join(' ').toLowerCase();

        const titleLower = title.toLowerCase();
        const titleMatches = titleLower.includes(lowerQuery);
        const keywordMatches = conceptString && (conceptString.includes(lowerQuery) || tokens.some((t) => t && conceptString.includes(t)));

        if (!titleMatches && !keywordMatches) {
          continue;
        }

        let urlRec = '';
        if (doi) {
          urlRec = `https://doi.org/${doi}`;
        } else if (it.primary_location?.landing_page_url) {
          urlRec = it.primary_location.landing_page_url;
        } else if (it.id) {
          urlRec = String(it.id).replace(/^https?:\/\/openalex.org\//i, 'https://openalex.org/');
        }

        let record: any = {
          id: `openalex-${it.id || Date.now()}`,
          title,
          authors,
          description: it.abstract_inverted_index ? stripHtml(Object.keys(it.abstract_inverted_index).join(' ')) : '',
          keywords: concepts,
          year: pubYear,
          source: 'OpenAlex (Datasets)',
          type: 'Research Data',
          identifier: doi || String(it.id || ''),
          identifierType: doi ? 'DOI' : 'OpenAlex ID',
          url: urlRec,
        };

        if (detectDryad(record.identifier, record.url)) {
          record.source = 'Dryad Digital Repository';
        } else if (detectZenodo(record.identifier, record.url)) {
          record.source = 'Zenodo';
        } else if (detectMendeley(record.identifier, record.url)) {
          record.source = 'Mendeley Data';
        }

        mapped.push(record);
      } catch (e) {
        console.error('OpenAlex mapping error:', (e as Error).message);
      }
    }

    const total = data.meta?.count || mapped.length;
    const hasMore = Boolean(data.meta?.next_cursor);

    return { records: mapped, total, hasMore };
  },
});

export const bulkUpsertRecordsInternal = internalMutation({
  args: {
    records: v.array(v.object({
      id: v.string(),
      title: v.string(),
      authors: v.array(v.string()),
      description: v.optional(v.string()),
      keywords: v.array(v.string()),
      year: v.optional(v.number()),
      source: v.string(),
      type: v.string(),
      identifier: v.optional(v.string()),
      identifierType: v.optional(v.string()),
      url: v.optional(v.string()),
      category: v.string(),
    })),
    clearCategory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const importDate = Date.now();

    if (args.clearCategory) {
      const existing = await ctx.db.query("records")
        .withIndex("by_category", q => q.eq("category", args.clearCategory!))
        .collect();
      for (const r of existing) {
        await ctx.db.delete(r._id);
      }
    }

    let inserted = 0;
    for (const rec of args.records) {
      if (args.clearCategory) {
        await ctx.db.insert("records", { ...rec, importDate });
        inserted++;
      } else {
        const existing = await ctx.db.query("records")
          .withIndex("by_record_id", q => q.eq("id", rec.id))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, { ...rec, importDate });
        } else {
          await ctx.db.insert("records", { ...rec, importDate });
          inserted++;
        }
      }
    }

    return inserted;
  },
});

export const updateLibraryMetaInternal = internalMutation({
  args: {
    key: v.string(),
    counts: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
      total: v.number(),
    }),
    lastHarvest: v.optional(v.number()),
    lastError: v.optional(v.object({
      context: v.string(),
      message: v.string(),
      time: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("libraryMeta")
      .withIndex("by_key", q => q.eq("key", args.key))
      .first();

    const data = {
      ...args,
      lastUpdated: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("libraryMeta", data);
    }
  },
});

export const countByCategoryInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const theses = await ctx.db.query('records').withIndex('by_category', q => q.eq('category', 'thesis')).collect();
    const articles = await ctx.db.query('records').withIndex('by_category', q => q.eq('category', 'article')).collect();
    const research = await ctx.db.query('records').withIndex('by_category', q => q.eq('category', 'research')).collect();
    
    return {
      thesis: theses.length,
      article: articles.length,
      research: research.length,
      total: theses.length + articles.length + research.length,
    };
  },
});

export const exportRis = query({
  args: {
    recordIds: v.array(v.string()),
  },
  handler: async (ctx, args): Promise<string> => {
    const lines: string[] = [];

    for (const recordId of args.recordIds) {
      const record = await ctx.db.query("records")
        .withIndex("by_record_id", q => q.eq("id", recordId))
        .first();

      if (!record) continue;

      if (record.authors && record.authors.length > 0) {
        for (const author of record.authors) {
          lines.push(`AU  - ${author}`);
        }
      }

      if (record.year) {
        lines.push(`PY  - ${record.year}`);
      }

      if (record.title) {
        lines.push(`TI  - ${record.title}`);
      }

      if (record.description) {
        const desc = record.description.slice(0, 500);
        lines.push(`AB  - ${desc}`);
      }

      if (record.keywords && record.keywords.length > 0) {
        for (const kw of record.keywords) {
          lines.push(`KW  - ${kw}`);
        }
      }

      if (record.identifier) {
        if (record.identifierType === 'DOI') {
          lines.push(`DO  - ${record.identifier}`);
        } else {
          lines.push(`M3  - ${record.identifier}`);
        }
      }

      if (record.url) {
        lines.push(`UR  - ${record.url}`);
      }

      let risType = 'GEN';
      if (/(thesis|dissertation)/i.test(record.type || '')) risType = 'THES';
      else if (/article/i.test(record.type || '')) risType = 'JOUR';
      else if (/book/i.test(record.type || '')) risType = 'BOOK';
      else if (/dataset/i.test(record.type || '')) risType = 'DATA';

      lines.push(`TY  - ${risType}`);
      lines.push('ER  - ');
      lines.push('');
    }

    return lines.join('\n');
  },
});
