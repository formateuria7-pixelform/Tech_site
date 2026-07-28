import React from 'react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, FileSpreadsheetIcon, PrinterIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  exportValue?: (row: T) => string;
  className?: string;
};

type Props<T> = {
  title: string;
  rows: T[];
  columns: Column<T>[];
  searchKeys: (row: T) => string;
  rowKey: (row: T) => string;
  filters?: {label: string;options: {value: string;label: string;}[];value: string;onChange: (v: string) => void;}[];
  emptyText: string;
  actions?: React.ReactNode;
  pageSize?: number;
};

/** Tableau administrable : recherche, filtres, pagination, export Excel (CSV) et PDF. */
export function DataTable<T>({
  title,
  rows,
  columns,
  searchKeys,
  rowKey,
  filters = [],
  emptyText,
  actions,
  pageSize = 8
}: Props<T>) {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return rows;
    return rows.filter((r) => searchKeys(r).toLowerCase().includes(q));
  }, [rows, query, searchKeys]);

  React.useEffect(() => setPage(1), [query, rows.length]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCsv = () => {
    const header = columns.map((c) => c.header).join(';');
    const body = filtered.
    map((r) =>
    columns.
    map((c) => {
      const raw = c.exportValue ? c.exportValue(r) : String(c.render(r) ?? '');
      return `"${raw.replace(/"/g, '""')}"`;
    }).
    join(';')
    ).
    join('\n');
    const blob = new Blob([`\ufeff${header}\n${body}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export Excel généré');
  };

  const exportPdf = () => {
    const win = window.open('', '_blank', 'width=1000,height=900');
    if (!win) {
      toast.error('Autorisez les fenêtres surgissantes pour l’export PDF.');
      return;
    }
    const header = columns.map((c) => `<th>${c.header}</th>`).join('');
    const body = filtered.
    map(
      (r) =>
      `<tr>${columns.
      map((c) => `<td>${c.exportValue ? c.exportValue(r) : ''}</td>`).
      join('')}</tr>`
    ).
    join('');
    win.document.write(
      `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title><style>
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:32px;color:#111}
        h1{font-size:20px;margin:0 0 4px}p{color:#666;font-size:12px;margin:0 0 24px}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th{text-align:left;border-bottom:2px solid #111;padding:8px;text-transform:uppercase;font-size:10px;letter-spacing:.08em}
        td{padding:8px;border-bottom:1px solid #eee}
      </style></head><body><h1>OHMEGA — ${title}</h1><p>${filtered.length} enregistrement(s) — export du ${new Date().toLocaleString('fr-FR')}</p>
      <table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>
      <script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>`
    );
    win.document.close();
  };

  return (
    <div className="rounded-2xl border border-paper/10 bg-coal">
      <div className="flex flex-wrap items-center gap-3 border-b border-paper/10 p-5">
        <h2 className="font-display text-base font-semibold text-paper">{title}</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
          {filtered.length} enregistrement{filtered.length > 1 ? 's' : ''}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {actions}
          <Button size="sm" variant="outline" onClick={exportCsv}>
            <FileSpreadsheetIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Excel
          </Button>
          <Button size="sm" variant="outline" onClick={exportPdf}>
            <PrinterIcon className="h-3.5 w-3.5" aria-hidden="true" />
            PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-paper/10 p-5">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Rechercher dans {title}</span>
          <SearchIcon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog"
            aria-hidden="true" />
          
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="w-full rounded-xl border border-paper/12 bg-ink py-2.5 pl-10 pr-4 text-sm text-paper placeholder:text-fog/60 focus:border-volt focus:outline-none" />
          
        </label>
        {filters.map((f) =>
        <label key={f.label} className="flex items-center gap-2 text-xs text-fog">
            {f.label}
            <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="rounded-xl border border-paper/12 bg-ink px-3 py-2 text-xs text-paper focus:border-volt focus:outline-none">
            
              {f.options.map((o) =>
            <option key={o.value} value={o.value}>
                  {o.label}
                </option>
            )}
            </select>
          </label>
        )}
      </div>

      {filtered.length === 0 ?
      <p className="p-10 text-center text-sm text-fog">{emptyText}</p> :

      <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-paper/10">
                  {columns.map((c) =>
                <th
                  key={c.key}
                  scope="col"
                  className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                  
                      {c.header}
                    </th>
                )}
                </tr>
              </thead>
              <tbody>
                {current.map((row) =>
              <tr key={rowKey(row)} className="border-b border-paper/8 last:border-0 hover:bg-paper/[0.03]">
                    {columns.map((c) =>
                <td key={c.key} className={`px-5 py-4 text-sm text-paper ${c.className ?? ''}`}>
                        {c.render(row)}
                      </td>
                )}
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          {pages > 1 &&
        <div className="flex items-center justify-between gap-4 border-t border-paper/10 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                Page {page} sur {pages}
              </p>
              <div className="flex gap-2">
                <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Page précédente"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper hover:border-volt disabled:opacity-30">
              
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              aria-label="Page suivante"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper hover:border-volt disabled:opacity-30">
              
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
        }
        </>
      }
    </div>);

}