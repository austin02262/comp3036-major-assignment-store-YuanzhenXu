'use client';

import { useState } from 'react';

type PostListItem = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  imageUrl: string;
  tags: string;
  category: string;
  active: boolean;
  date: string | Date;
};

/**
 * Formats a date object into a readable string
 */
const formatDate = (dateValue: string | Date) => {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

/**
 * Formats comma-separated tags into display format (e.g., "#Front-End, #Dev Tools")
 */
const formatTags = (tags: string): string => {
  return tags.split(',').map((tag) => `#${tag.trim()}`).join(', ');
};

/**
 * Parse date filter input (MMDDYYYY format)
 * Returns Date object if valid, null otherwise
 */
function parseDateFilter(value: string): Date | null {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 8) {
    return null;
  }

  const month = Number(digits.slice(0, 2));
  const day = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

type SortOption = "title-asc" | "title-desc" | "date-asc" | "date-desc";

export function PostList({ initialPosts }: { initialPosts: PostListItem[] }) {
  // Start from server-provided posts so this component works with database records, not mock data.
  const [posts, setPosts] = useState(initialPosts);
  const [filterContent, setFilterContent] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusError, setStatusError] = useState('');

  const normalizedContentFilter = filterContent.trim().toLowerCase();
  const normalizedTagFilter = filterTag.trim().toLowerCase();
  const normalizedDateFilter = filterDate.trim().toLowerCase();
  const parsedDateFilter = parseDateFilter(filterDate);

  const filteredPosts = posts
    .filter((post) => {
      const postDate = new Date(post.date);

      const matchesContent =
        normalizedContentFilter.length === 0 ||
        post.title.toLowerCase().includes(normalizedContentFilter) ||
        post.content.toLowerCase().includes(normalizedContentFilter);

      const matchesTag =
        normalizedTagFilter.length === 0 ||
        post.tags.toLowerCase().includes(normalizedTagFilter);

      const matchesDate =
        normalizedDateFilter.length === 0 ||
        (parsedDateFilter
          ? postDate >= parsedDateFilter
          : [
              formatDate(post.date).toLowerCase(),
              postDate.toISOString().slice(0, 10).toLowerCase(),
              `${String(postDate.getMonth() + 1).padStart(2, '0')}${String(
                postDate.getDate(),
              ).padStart(2, '0')}${postDate.getFullYear()}`,
            ].some((value) => value.includes(normalizedDateFilter)));

      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'active' && post.active) ||
        (visibilityFilter === 'inactive' && !post.active);

      return matchesContent && matchesTag && matchesDate && matchesVisibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });

  const togglePostState = async (postId: number) => {
    setStatusMessage('');
    setStatusError('');

    // PATCH flips the active flag in the database and returns the updated status only.
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      setStatusError('Could not update post status. Please try again.');
      return;
    }

    const updatedPost = (await response.json()) as { id: number; active: boolean };

    // Update local state after the API call so the button changes immediately without a full reload.
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, active: updatedPost.active } : post,
      ),
    );

    setStatusMessage(
      `Post is now ${updatedPost.active ? 'active' : 'inactive'}.`,
    );
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '32px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div>
          <label htmlFor="filterContent">Filter by Content:</label>
          <input
            id="filterContent"
            type="text"
            placeholder="Search title or content..."
            value={filterContent}
            onChange={(event) => setFilterContent(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filterTag">Filter by Tag:</label>
          <input
            id="filterTag"
            type="text"
            placeholder="e.g. Front"
            value={filterTag}
            onChange={(event) => setFilterTag(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filterDate">Filter by Date Created:</label>
          <input
            id="filterDate"
            type="text"
            placeholder="MMDDYYYY"
            value={filterDate}
            onChange={(event) => setFilterDate(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="visibilityFilter">Filter by Visibility:</label>
          <select
            id="visibilityFilter"
            value={visibilityFilter}
            onChange={(event) =>
              setVisibilityFilter(event.target.value as 'all' | 'active' | 'inactive')
            }
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
          >
            <option value="date-desc">Date (Newest first)</option>
            <option value="date-asc">Date (Oldest first)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {(statusMessage || statusError) && (
        <p
          style={{
            marginBottom: '20px',
            padding: '12px',
            borderRadius: '6px',
            background: statusError ? '#fef2f2' : '#ecfdf5',
            color: statusError ? '#b91c1c' : '#065f46',
          }}
        >
          {statusError || statusMessage}
        </p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {filteredPosts.map((post) => {
          const tagsString = formatTags(post.tags);

          return (
            <article key={post.id} style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />

              <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>
                  <a href={`/post/${post.urlId}`} style={{ color: '#1a1a2e', textDecoration: 'none' }}>
                    {post.title}
                  </a>
                </h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    padding: '4px 10px',
                    background: '#e0e7ff',
                    color: '#4338ca',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {post.category}
                  </span>
                  <span style={{
                    padding: '4px 10px',
                    background: '#f3f4f6',
                    color: '#4b5563',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {tagsString}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  Posted on {formatDate(post.date)}
                </div>

                <button
                  type="button"
                  onClick={() => void togglePostState(post.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: post.active ? '#10b981' : '#ef4444',
                    color: 'white',
                    borderRadius: '6px'
                  }}
                >
                  {post.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
