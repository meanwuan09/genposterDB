import Link from 'next/link';
import type { AuthUser, PlaceListItem } from '../../lib/types';

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString('vi-VN') : '—';
}

function userLabel(user: { name: string | null; email: string } | null) {
  return user?.name ?? user?.email ?? '—';
}

export function PlaceTable({ places, user }: { places: PlaceListItem[]; user: AuthUser }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Quán</th>
          <th>Vị trí</th>
          <th>Loại</th>
          <th>Giá</th>
          {user.role === 'admin' ? <th>Partner</th> : null}
          <th>Trạng thái</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {places.map((place) => (
          <tr key={place.id}>
            <td>
              {place.primaryImage?.imageUrl ? <img className="thumb" src={place.primaryImage.imageUrl} alt={place.name} /> : <div className="thumb placeholder">No image</div>}
            </td>
            <td>
              <Link href={`/places/${place.id}`}>
                <strong>{place.name}</strong>
                <div className="muted">#{place.id} · {place.categoryName ?? `Category ${place.categoryId}`}</div>
              </Link>
            </td>
            <td>{[place.address, place.district, place.city].filter(Boolean).join(', ') || '—'}</td>
            <td>{[place.serviceType, place.mealType].filter(Boolean).join(' · ') || '—'}</td>
            <td>{place.priceText ?? '—'}</td>
            {user.role === 'admin' ? <td>{place.partnerRelation ?? '—'} · {place.partnerPriority}</td> : null}
            <td><span className={place.isActive ? 'badge' : 'badge off'}>{place.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
            <td>
              <div>{formatDate(place.updatedAt)}</div>
              <div className="muted">{userLabel(place.updatedBy)}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
