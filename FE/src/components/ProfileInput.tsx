import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfileInput({ onSubmit, disabled }: {
  onSubmit: (data: { age?: number; region?: string; category?: string; query: string }) => void;
  disabled?: boolean;
}) {
  const [form, setForm] = useState({ age: '', region: '', category: '', query: '' });
  const regions = [
                    '서울특별시', '종로구', '중구', '용산구', '강남구', '강서구', '강동구',
                    '강북구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구',
                    '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구',
                    '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구'];
  const categories = ['취업', '창업', '주거', '교육', '복지', '문화예술', '금융지원'];

  const handleChange = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.query.trim()) return;
    onSubmit({
      query: form.query,
      age: form.age ? Number(form.age) : undefined,
      region: form.region || undefined,
      category: form.category || undefined,
    });
    setForm(f => ({ ...f, query: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input type="number" placeholder="나이(선택)" value={form.age}
          onChange={e => handleChange('age', e.target.value)} className="w-20" min={19} max={39} />
        <Select value={form.region} onValueChange={v => handleChange('region', v)}>
          <SelectTrigger className="w-28"><SelectValue placeholder="지역(선택)" /></SelectTrigger>
          <SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={form.category} onValueChange={v => handleChange('category', v)}>
          <SelectTrigger className="w-28"><SelectValue placeholder="분야(선택)" /></SelectTrigger>
          <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Input placeholder="궁금한 정책을 입력하세요" value={form.query}
          onChange={e => handleChange('query', e.target.value)} className="flex-1" disabled={disabled} required />
        <Button type="submit" disabled={disabled || !form.query.trim()}>검색</Button>
      </div>
    </form>
  );
}