'use client';

import { Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ViewersCount() {
  const [viewersCount, setViewersCount] = useState(0);

  useEffect(() => {
    async function fetchViewersCount() {
      try {
        const response = await fetch(
          'https://nwl36ysqi7.execute-api.us-east-1.amazonaws.com'
        );
        const data = await response.json();
        setViewersCount(data.visitor_count);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    }

    fetchViewersCount();
  }, []);

  return (
    <>
      <Eye size={18} />
      {viewersCount !== null ? viewersCount : 'Loading...'}
    </>
  );
}
