import Link from 'next/link';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  searchParams: Record<string, string | undefined>;
};

function hrefForPage(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== 'page') params.set(key, value);
  }

  params.set('page', String(page));
  return `/places?${params.toString()}`;
}

export function Pagination({ page, pageSize, total, searchParams }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="card actions" style={{ justifyContent: 'space-between' }}>
      <span className="muted">Trang {page} / {totalPages} · {total} quán</span>
      <div className="actions">
        {page > 1 ? <Link className="button secondary" href={hrefForPage(searchParams, page - 1)}>Trước</Link> : <span className="button secondary" style={{ opacity: 0.5 }}>Trước</span>}
        {page < totalPages ? <Link className="button secondary" href={hrefForPage(searchParams, page + 1)}>Sau</Link> : <span className="button secondary" style={{ opacity: 0.5 }}>Sau</span>}
      </div>
    </div>
  );
}
