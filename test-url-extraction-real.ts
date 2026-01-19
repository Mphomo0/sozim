#!/usr/bin/env tsx

import { extract, makeRecordFromBlock } from './lib/oai-parser'

// Sample E-LIS XML block (from actual data)
const elisBlock = `<record>
    <metadata>
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:relation>http://eprints.rclis.org/3780/</dc:relation>
        <dc:title>La alfabetización informacional desde una perspectiva global: el desastre agudiza nuestras mentes</dc:title>
        <dc:creator>Byrne, Alex</dc:creator>
        <dc:identifier>http://eprints.rclis.org/3780/1/1631.pdf</dc:identifier>
      </oai_dc:dc>
    </metadata>
  </record>`

console.log('=== Testing URL Extraction ===\n')

const record = makeRecordFromBlock(elisBlock, 'elis')

console.log('Record created:')
console.log('  Title:', record.title)
console.log('  Authors:', record.authors.join(', '))
console.log('  URL:', record.url)
console.log('  Identifier:', record.identifier)
console.log('  Identifier Type:', record.identifierType)
console.log('  Source:', record.source)
console.log('  Year:', record.year)
console.log('')

if (record.url && record.url !== '' && record.url !== '#') {
  console.log('✅ SUCCESS: Record has valid URL!')
  console.log('   Users can read full article at:', record.url)
} else {
  console.log('❌ FAIL: No URL found')
  console.log('   This record will show "No external link available" in UI')
}

console.log('\n=== Testing Multiple Identifier Fields ===\n')

// Test case with multiple dc:identifier fields
const multiIdBlock = `<record>
    <metadata>
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier>https://hdl.handle.net/12345/67890</dc:identifier>
        <dc:identifier>http://eprints.rclis.org/3780/1/file.pdf</dc:identifier>
        <dc:relation>http://eprints.rclis.org/3780/</dc:relation>
        <dc:title>Test Multiple Identifiers</dc:title>
        <dc:creator>Test Author</dc:creator>
      </oai_dc:dc>
    </metadata>
  </record>`

const record2 = makeRecordFromBlock(multiIdBlock, 'test-repo')

console.log('Record 2 created:')
console.log('  Title:', record2.title)
console.log('  URL:', record2.url)
console.log('  Identifier:', record2.identifier)
console.log('  Identifier Type:', record2.identifierType)
console.log('')

if (record2.url && record2.url !== '' && record2.url !== '#') {
  console.log('✅ SUCCESS: Multiple identifiers handled correctly!')
} else {
  console.log('❌ FAIL: Multiple identifiers not handled')
}

console.log('\n=== Test Summary ===\n')
console.log('If both tests show SUCCESS, URL extraction is working 100%')
console.log('If tests show FAIL, check extractBestUrl() function')
