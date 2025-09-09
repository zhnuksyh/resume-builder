"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Plus,
  Trash2,
  FileText,
  Heart,
  Users,
  Info,
  UserCheck,
  FolderOpen,
  Award,
  Calendar,
  MapPin,
  Globe,
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  GripVertical,
} from "lucide-react";
import { AddCustomSectionDialog } from "./add-custom-section-dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Tab Component
function SortableTab({
  section,
  isActive,
  onSectionChange,
  getSectionStatus,
  getCustomSectionIcon,
}: {
  section: ResumeSection;
  isActive: boolean;
  onSectionChange: (section: string) => void;
  getSectionStatus: (sectionId: string) => string;
  getCustomSectionIcon: (title: string) => any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.section_type });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const status = getSectionStatus(section.section_type);
  const sectionTitle = section.title || "Custom Section";
  const capitalizedTitle = sectionTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  const CustomIcon = getCustomSectionIcon(sectionTitle);

  return (
    <TabsTrigger
      ref={setNodeRef}
      style={style}
      value={section.section_type}
      className={`flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary/30 data-[state=active]:text-primary data-[state=active]:border-primary/50 data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground whitespace-nowrap ${
        isActive ? "bg-primary/30 text-primary border-primary/50 shadow-sm" : ""
      }`}
      onClick={() => onSectionChange(section.section_type)}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mr-1"
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
      <CustomIcon className="h-4 w-4 flex-shrink-0" />
      <span className="hidden sm:inline">{capitalizedTitle}</span>
      <span className="sm:hidden">{capitalizedTitle.split(" ")[0]}</span>
      <div className="ml-2 flex-shrink-0">
        {status === "completed" && (
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        )}
        {status === "empty" && (
          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
        )}
      </div>
    </TabsTrigger>
  );
}

interface ResumeSection {
  id: string;
  section_type: string;
  title: string | null;
  content: any;
}

interface SectionTabsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: ResumeSection[];
  onAddCustomSection?: (title: string) => void;
  onDeleteCustomSection?: (sectionType: string) => void;
  onReorderCustomSections?: (newOrder: ResumeSection[]) => void;
}

const sectionConfig = [
  {
    id: "personal_info",
    label: "Personal Info",
    icon: User,
    required: true,
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    required: false,
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    required: false,
  },
  {
    id: "skills",
    label: "Skills",
    icon: Wrench,
    required: false,
  },
];

export function SectionTabs({
  activeSection,
  onSectionChange,
  sections,
  onAddCustomSection,
  onDeleteCustomSection,
  onReorderCustomSections,
}: SectionTabsProps) {
  const getSectionStatus = (sectionId: string) => {
    const section = sections.find((s) => s.section_type === sectionId);
    if (!section) return "empty";

    const content = section.content;
    if (!content || Object.keys(content).length === 0) return "empty";

    // Check if section has meaningful content
    if (sectionId === "personal_info") {
      return content.fullName || content.email ? "completed" : "empty";
    }

    if (sectionId === "experience" || sectionId === "education") {
      return content.items && content.items.length > 0 ? "completed" : "empty";
    }

    if (sectionId === "skills") {
      return content.skills && content.skills.length > 0
        ? "completed"
        : "empty";
    }

    // For custom sections, check if they have items
    if (sectionId.startsWith("custom_")) {
      return content.items && content.items.length > 0 ? "completed" : "empty";
    }

    return "completed";
  };

  const customSections = sections.filter((section) =>
    section.section_type.startsWith("custom_")
  );

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && onReorderCustomSections) {
      const oldIndex = customSections.findIndex(
        (section) => section.section_type === active.id
      );
      const newIndex = customSections.findIndex(
        (section) => section.section_type === over?.id
      );

      const newOrder = arrayMove(customSections, oldIndex, newIndex);
      onReorderCustomSections(newOrder);
    }
  };

  // Function to get unique icon for custom sections based on title
  const getCustomSectionIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();

    // Map common section titles to specific icons
    if (lowerTitle.includes("volunteer") || lowerTitle.includes("charity"))
      return Heart;
    if (
      lowerTitle.includes("organization") ||
      lowerTitle.includes("club") ||
      lowerTitle.includes("team")
    )
      return Users;
    if (lowerTitle.includes("project") || lowerTitle.includes("portfolio"))
      return FolderOpen;
    if (
      lowerTitle.includes("award") ||
      lowerTitle.includes("achievement") ||
      lowerTitle.includes("certification")
    )
      return Award;
    if (lowerTitle.includes("reference") || lowerTitle.includes("testimonial"))
      return UserCheck;
    if (lowerTitle.includes("language") || lowerTitle.includes("fluency"))
      return Globe;
    if (
      lowerTitle.includes("publication") ||
      lowerTitle.includes("research") ||
      lowerTitle.includes("paper")
    )
      return BookOpen;
    if (lowerTitle.includes("hobby") || lowerTitle.includes("interest"))
      return Lightbulb;
    if (lowerTitle.includes("goal") || lowerTitle.includes("objective"))
      return Target;
    if (lowerTitle.includes("activity") || lowerTitle.includes("event"))
      return Calendar;
    if (lowerTitle.includes("location") || lowerTitle.includes("address"))
      return MapPin;
    if (
      lowerTitle.includes("additional") ||
      lowerTitle.includes("extra") ||
      lowerTitle.includes("other")
    )
      return Info;
    if (lowerTitle.includes("skill") || lowerTitle.includes("competency"))
      return Zap;

    // Default icons for other sections
    const defaultIcons = [
      Heart,
      Users,
      FolderOpen,
      Award,
      UserCheck,
      Globe,
      BookOpen,
      Lightbulb,
      Target,
      Calendar,
      MapPin,
      Info,
      Zap,
    ];
    const hash = title.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return defaultIcons[hash % defaultIcons.length];
  };

  return (
    <div className="w-full">
      <Tabs
        value={activeSection}
        onValueChange={onSectionChange}
        className="w-full"
      >
        {/* Main Section Tabs */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="flex w-max min-w-full bg-muted/70 border border-border/50">
                {sectionConfig.map((section) => {
                  const Icon = section.icon;
                  const status = getSectionStatus(section.id);

                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary/30 data-[state=active]:text-primary data-[state=active]:border-primary/50 data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline">{section.label}</span>
                      <span className="sm:hidden">
                        {section.label.split(" ")[0]}
                      </span>
                      {section.required && (
                        <Badge
                          variant="secondary"
                          className="text-xs ml-1 flex-shrink-0"
                        >
                          Required
                        </Badge>
                      )}
                      <div className="ml-2 flex-shrink-0">
                        {status === "completed" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                        {status === "empty" && (
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
                        )}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {onAddCustomSection && (
            <div className="flex-shrink-0 ml-4">
              <AddCustomSectionDialog onAddSection={onAddCustomSection} />
            </div>
          )}
        </div>

        {/* Custom Sections Tab Bar - Below the main tabs */}
        {customSections.length > 0 && (
          <div className="mb-6">
            <div className="flex-1 min-w-0">
              <div className="overflow-x-auto scrollbar-hide">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={customSections.map((s) => s.section_type)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <TabsList className="flex w-max min-w-full bg-muted/70 border border-border/50">
                      {customSections.map((section) => (
                        <SortableTab
                          key={section.section_type}
                          section={section}
                          isActive={activeSection === section.section_type}
                          onSectionChange={onSectionChange}
                          getSectionStatus={getSectionStatus}
                          getCustomSectionIcon={getCustomSectionIcon}
                        />
                      ))}
                    </TabsList>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}
