import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radar Thị Trường | Gia Anh Furniture',
  description: 'Quan sát thị trường, so giá đối thủ, AI tổng hợp action items hàng tuần',
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
