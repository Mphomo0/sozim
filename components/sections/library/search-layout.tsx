'use client'

import { useState } from 'react'
import { SearchFilters } from './search-filters'
import { ArticleGrid } from './article-grid'

// Sample data for demonstration
const sampleArticles = [
  {
    id: 1,
    source: 'Research Data',
    repository: 'Zenodo',
    title: 'AngleDome, Gas flow conditioning through reflection',
    authors: ['Kim, Jae Un'],
    year: 2025,
    doi: '10.5281/zenodo.17614147',
  },
  {
    id: 2,
    source: 'Research Data',
    repository: 'Zenodo',
    title:
      'The experimental date for the paper "Entanglement-enhanced quantum lock-in detection achieving Heisenberg scaling"',
    authors: ['Jiawei, Zhang'],
    year: 2025,
    doi: '10.5281/zenodo.17614133',
  },
  {
    id: 3,
    source: 'Research Data',
    repository: 'Zenodo',
    title:
      'Modul Digital Panduan Penggunaan Website Permainan Tradisional Statak',
    authors: ['Susilawati'],
    year: 2025,
    doi: '10.5281/zenodo.17614129',
    description:
      'Modul Panduan Permainan Seatak Digital merupakan bahan ajar digital yang dirancang untuk mendukung guru dan siswa Sekolah Dasar (kelas 4, 5, dan 6) dalam memanfaatkan permainan Seatak Digital sebagai media pembelajaran matematika yang interaktif dan menyenangkan. Modul...',
  },
  {
    id: 4,
    source: 'Research Data',
    repository: 'Zenodo',
    title:
      'ФЕНОМЕНАЛЬНОЕ ОБУЧЕНИЕ: ТВОРЧЕСТВО ДИМАША КУДАЙБЕРГЕНА КАК СИНТЕЗ НАЦИОНАЛЬНОГО НАСЛЕДИЯ И СОВРЕМЕННЫХ ИННОВАЦИЙ',
    authors: ['Кадыр Жанетта Нурланқызы', 'Мукеева Нуржамал Ерсайдновна'],
    year: 2025,
    doi: '10.5281/zenodo.17614136',
    description:
      "Ushbu maqolada Dimash Qudaybergen ijodi misolida musiqiy ta'limda fenomenal ol'itish ikoniyatlari ko'rib chiqiladi. Uning ijodiy an'anaviy meros va zamomaviy innovatsiyalarning noyob sintezini ifodalayydi, busa mazkur fenomenni ta'1...",
  },
]

export function SearchLayout() {
  const [filters, setFilters] = useState({
    year: 'All Years',
    repository: 'All Repositories',
    type: 'All Types',
    author: '',
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Articles Grid */}
        <div className="lg:col-span-3">
          <ArticleGrid articles={sampleArticles} />
        </div>
      </div>
    </div>
  )
}
