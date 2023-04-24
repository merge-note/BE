interface MemoContent {
  title: string;
  content: string;
}

interface Memo extends MemoContent {
  id: number;
  user_id: number;
  created_at: string;
}

interface MemoPaginationData {
  memos: Memo[];
  pageCount: number;
  totalCount: number;
}
