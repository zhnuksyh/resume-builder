-- Update existing sections with title "organizations" to "organization"
UPDATE public.resume_sections 
SET title = 'organization'
WHERE LOWER(title) = 'organizations';

-- Also update any section_type that might be "organizations"
UPDATE public.resume_sections 
SET section_type = 'organization'
WHERE section_type = 'organizations';

-- Update any content that might have "organizations" in the JSON
UPDATE public.resume_sections 
SET content = jsonb_set(
  content, 
  '{title}', 
  '"organization"'
)
WHERE content->>'title' = 'organizations';

-- Update any items in the content that might have "organizations" as a field value
UPDATE public.resume_sections 
SET content = jsonb_set(
  content, 
  '{items}', 
  (
    SELECT jsonb_agg(
      CASE 
        WHEN item->>'organization' IS NOT NULL THEN
          jsonb_set(item, '{organization}', item->'organization')
        ELSE item
      END
    )
    FROM jsonb_array_elements(content->'items') AS item
  )
)
WHERE content ? 'items' 
  AND content->'items' IS NOT NULL 
  AND jsonb_typeof(content->'items') = 'array';
