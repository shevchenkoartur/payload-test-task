'use client'
import { useMemo, useState } from 'react'

type Option = { id: string; title: string }
export default function CategoryMultiSelect({ options, name = 'categories' }: {
  options: Option[]
  name?: string
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Option[]>([])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? options.filter(o => o.title.toLowerCase().includes(q)) : options
  }, [options, query])

  function add(option: Option) {
    if (selected.some(s => s.id === option.id)) return
    setSelected(prev => [...prev, option])
    setQuery('')
  }
  function remove(id: string) {
    setSelected(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-2">
      {selected.map(s => (
        <input key={s.id} type="hidden" name={name} value={s.id} />
      ))}


      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(s => (
            <span key={s.id} className="text-xs bg-gray-100 border px-2 py-1 rounded inline-flex items-center gap-1">
              {s.title}
              <button type="button" onClick={() => remove(s.id)} className="opacity-60 hover:opacity-100">×</button>
            </span>
          ))}
        </div>
      )}

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Find category…"
        className="w-full border p-2 rounded"
      />

      <div className="max-h-40 overflow-auto border rounded">
        {filtered.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">Nothing found</div>
        ) : (
          filtered.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => add(opt)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
            >
              {opt.title}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
