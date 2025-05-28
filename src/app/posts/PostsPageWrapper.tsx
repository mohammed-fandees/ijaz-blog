'use client';

import React, { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import dynamic from 'next/dynamic';

const PostsPageClient = dynamic(() => import('./PostsPageClient'), {
  ssr: false,
  loading: () => <Loading size="lg" />,
});

export default function PostsPageWrapper() {
  return (
    <Suspense fallback={<Loading size="lg" />}>
      <PostsPageClient />
    </Suspense>
  );
}
