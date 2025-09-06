-- Create function to update resume updated_at when sections change
CREATE OR REPLACE FUNCTION public.update_resume_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the resume's updated_at timestamp when any section is modified
  UPDATE public.resumes 
  SET updated_at = NOW()
  WHERE id = COALESCE(NEW.resume_id, OLD.resume_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_resume_section_updated ON public.resume_sections;
DROP TRIGGER IF EXISTS on_resume_section_inserted ON public.resume_sections;
DROP TRIGGER IF EXISTS on_resume_section_deleted ON public.resume_sections;

-- Create triggers for INSERT, UPDATE, and DELETE on resume_sections
CREATE TRIGGER on_resume_section_updated
  AFTER UPDATE ON public.resume_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resume_updated_at();

CREATE TRIGGER on_resume_section_inserted
  AFTER INSERT ON public.resume_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resume_updated_at();

CREATE TRIGGER on_resume_section_deleted
  AFTER DELETE ON public.resume_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resume_updated_at();
