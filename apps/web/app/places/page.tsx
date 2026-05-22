import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pagination } from '../../components/common/Pagination';
import { PlaceTable } from '../../components/places/PlaceTable';
import { apiGet } from '../../lib/api';
import { getCurrentUser } from '../../lib/auth';
import type { Category, ListResponse, PlaceListItem } from '../../lib/types';

export default async function PlacesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }

  const [data, categories] = await Promise.all([
    apiGet<ListResponse<PlaceListItem>>(`/places?${query.toString()}`),
    apiGet<Category[]>('/categories')
  ]);

  return (
    <section className="page">
      <div className="header">
        <div>
          <h1>Quản lý quán ăn</h1>
          <p className="muted">List quán kèm ảnh, sort/filter và mở chi tiết để edit trực tiếp.</p>
        </div>
        <Link className="button" href="/places/new">Thêm quán</Link>
      </div>
      <form className="card filters">
        <label className="field"><span>Tìm kiếm</span><input name="q" defaultValue={params.q ?? ''} placeholder="Tên, địa chỉ, ghi chú..." /></label>
        <label className="field"><span>Sort</span><select name="sort" defaultValue={params.sort ?? 'updatedAt'}><option value="updatedAt">Updated</option><option value="name">Tên</option><option value="partnerPriority">Partner priority</option><option value="priceMin">Giá thấp nhất</option><option value="district">Quận/Huyện</option></select></label>
        <label className="field"><span>Order</span><select name="order" defaultValue={params.order ?? 'desc'}><option value="desc">Desc</option><option value="asc">Asc</option></select></label>
        <label className="field"><span>Danh mục</span><select name="categoryId" defaultValue={params.categoryId ?? ''}><option value="">Tất cả danh mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="field"><span>Active</span><select name="isActive" defaultValue={params.isActive ?? ''}><option value="">Tất cả</option><option value="true">Active</option><option value="false">Inactive</option></select></label>
        <button type="submit">Áp dụng</button>
      </form>
      <PlaceTable places={data.items} user={user} />
      <Pagination page={data.page} pageSize={data.pageSize} total={data.total} searchParams={params} />
    </section>
  );
}
