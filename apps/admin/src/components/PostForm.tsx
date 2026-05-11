// apps/admin/src/components/PostForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface Post {
  id?: number;
  urlId?: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  category?: string;
  active?: boolean;
}

interface PostFormProps {
  initialData?: Post;      // Data to pre-fill the form (used in edit mode)
  isEditing?: boolean;     // Flag to determine if we're editing or creating
}


export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  // Ref to the content textarea for cursor position management
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Form state - initialize with existing data if editing, otherwise empty strings
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    imageUrl: initialData?.imageUrl || '',
    tags: initialData?.tags || '',
    category: initialData?.category || 'React',
  });

  // Error state - stores validation error messages for each field
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Preview mode state - toggles between edit textarea and rendered markdown
  const [showPreview, setShowPreview] = useState(false);
  
  // Cursor position - saved when opening preview, restored when closing
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  
  // Submission state - tracks loading state and any submission errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const updateFormData = (nextData: Partial<typeof formData>) => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    setSubmitSuccess('');
    setFormData({ ...formData, ...nextData });
  };

  /**
   * Validates all form fields
   * 
   * Validation rules:
   * - Title: required
   * - Description: required, max 200 characters
   * - Content: required
   * - Image URL: required, must be valid URL format
   * - Tags: required, at least one tag (comma-separated)
   * 
   * @returns {boolean} True if all fields are valid, false otherwise
   */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Description validation - max 200 characters per requirements
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description is too long. Maximum is 200 characters';
    }

    // Content validation - supports markdown
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    // Image URL validation - must be a valid URL
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'This is not a valid URL';
      }
    }

    // Tags validation - comma-separated list, at least one tag required
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  /**
   * Toggles between edit mode and preview mode
   * Saves the current cursor position before switching to preview
   * so it can be restored when returning to edit mode.
   */
  const handlePreviewToggle = () => {
    if (!showPreview && contentRef.current) {
      // Save cursor position before showing preview
      setCursorPosition(contentRef.current.selectionStart);
    }
    setShowPreview(!showPreview);
  };

  /**
   * Restores cursor position when closing the preview
   * This ensures the user can continue editing from where they left off.
   */
  useEffect(() => {
    if (!showPreview && cursorPosition !== null && contentRef.current) {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [showPreview, cursorPosition]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

 
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold with **
      .replace(/__(.*?)__/g, '<strong>$1</strong>')      // Bold with __
      .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic with *
      .replace(/_(.*?)_/g, '<em>$1</em>')                // Italic with _
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')             // H1 heading
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')            // H2 heading
      .replace(/\n/g, '<br/>');                          // Line breaks
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    if (!validate()) {
      setSubmitError('Please fix the errors before saving');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const url = isEditing ? `/api/posts/${initialData?.id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      setSubmitSuccess('Post updated successfully');
      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/?saved=1');
        router.refresh();
      }, 3000);
    } catch {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      
      {/* ===== Title Field ===== */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
        />
        {errors.title && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
            {errors.title}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        {/* Category is now editable because it is stored in the database and shown on both admin/web pages. */}
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          value={formData.category}
          onChange={(e) => updateFormData({ category: e.target.value })}
        />
      </div>

      {/* ===== Description Field ===== */}
      {/* Max 200 characters as per assignment requirements */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
        {errors.description && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
            {errors.description}
          </p>
        )}
      </div>

      {/* ===== Content Field with Markdown Preview ===== */}
      {/* Preview button toggles between textarea and rendered HTML */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="content">Content (Markdown)</label>
        {!showPreview ? (
          // Edit mode: show textarea
          <textarea
            ref={contentRef}
            id="content"
            value={formData.content}
            onChange={(e) => updateFormData({ content: e.target.value })}
            rows={10}
          />
        ) : (
          // Preview mode: show rendered markdown
          <div
            data-test-id="content-preview"
            style={{ 
              border: '1px solid #d1d5db', 
              padding: '16px', 
              borderRadius: '6px',
              minHeight: '200px',
              background: '#f9fafb'
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content || '') }}
          />
        )}
        <button 
          type="button" 
          onClick={handlePreviewToggle}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            background: '#6b7280',
            color: 'white',
            borderRadius: '6px'
          }}
        >
          {showPreview ? 'Close Preview' : 'Preview'}
        </button>
        {errors.content && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
            {errors.content}
          </p>
        )}
      </div>

      {/* ===== Image URL Field with Live Preview ===== */}
      {/* Shows image preview as soon as a valid URL is entered */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="text"
          value={formData.imageUrl}
          onChange={(e) => updateFormData({ imageUrl: e.target.value })}
        />
        <div style={{ marginTop: '12px' }}>
          {formData.imageUrl && (
            <img
              data-test-id="image-preview"
              src={formData.imageUrl}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
            />
          )}
        </div>
        {errors.imageUrl && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
            {errors.imageUrl}
          </p>
        )}
      </div>

      {/* ===== Tags Field ===== */}
      {/* Comma-separated list, e.g., "react, nextjs, tutorial" */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          id="tags"
          type="text"
          placeholder="react, nextjs, tutorial"
          value={formData.tags}
          onChange={(e) => updateFormData({ tags: e.target.value })}
        />
        {errors.tags && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
            {errors.tags}
          </p>
        )}
      </div>

      {/* ===== Submission Error Summary ===== */}
      {/* Displayed when validation fails on submit */}
      {submitError && (
        <p style={{ 
          color: '#ef4444', 
          marginBottom: '16px', 
          padding: '12px', 
          background: '#fef2f2', 
          borderRadius: '6px' 
        }}>
          {submitError}
        </p>
      )}

      {submitSuccess && (
        <p style={{
          color: '#065f46',
          marginBottom: '16px',
          padding: '12px',
          background: '#ecfdf5',
          borderRadius: '6px'
        }}>
          {submitSuccess}
        </p>
      )}

      {/* ===== Save Button ===== */}
      {/* Disabled while submitting to prevent double submission */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '12px',
          background: '#2563eb',
          color: 'white',
          fontSize: '16px',
          borderRadius: '6px'
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
