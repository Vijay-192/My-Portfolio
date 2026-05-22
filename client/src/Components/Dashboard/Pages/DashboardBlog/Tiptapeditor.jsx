
import { TextStyle } from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { useEffect, useState } from "react";

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Pilcrow,
  Code,
  Quote,
  Undo,
  Redo,
  Type,
  Palette,
  ChevronDown,
} from "lucide-react";

const FONTS = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
];

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#6B7280" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#22C55E" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Lime", value: "#84CC16" },
];

const HEADINGS = [
  {
    label: "Normal Text",
    cls: "",
    action: (e) => e.chain().focus().setParagraph().run(),
    isActive: (e) => e.isActive("paragraph"),
  },
  {
    label: "Heading 1",
    cls: "h1",
    action: (e) =>
      e.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (e) => e.isActive("heading", { level: 1 }),
  },
  {
    label: "Heading 2",
    cls: "h2",
    action: (e) =>
      e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => e.isActive("heading", { level: 2 }),
  },
  {
    label: "Heading 3",
    cls: "h3",
    action: (e) =>
      e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => e.isActive("heading", { level: 3 }),
  },
  {
    label: "Heading 4",
    cls: "h4",
    action: (e) =>
      e.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: (e) => e.isActive("heading", { level: 4 }),
  },
  {
    label: "Heading 5",
    cls: "h5",
    action: (e) =>
      e.chain().focus().toggleHeading({ level: 5 }).run(),
    isActive: (e) => e.isActive("heading", { level: 5 }),
  },
  {
    label: "Heading 6",
    cls: "h6",
    action: (e) =>
      e.chain().focus().toggleHeading({ level: 6 }).run(),
    isActive: (e) => e.isActive("heading", { level: 6 }),
  },
];

function Dropdown({ label, icon, children }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center gap-1 rounded-md
          px-2 py-1.5 text-sm
          text-gray-600 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition
        "
      >
        {icon}

        <span className="hidden sm:inline">
          {label}
        </span>

        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div
            onClick={close}
            className="fixed inset-0 z-10"
          />

          <div
            className="
              absolute left-0 top-full z-20 mt-1
              min-w-[170px]
              overflow-hidden rounded-xl
              border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800
              shadow-xl
            "
          >
            {children({ close })}
          </div>
        </>
      )}
    </div>
  );
}
function ToolBtn({
  onClick,
  active,
  title,
  children,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-md p-2 transition
        ${
          active
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }
      `}
    >
      {children}
    </button>
  );
}

export default function TipTapEditor({
  value,
  onChange,
  clearTrigger,
}) {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },

        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),

      TextStyle,

      Color.configure({
        types: ["textStyle"],
      }),

      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],

    content: value || "",

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());

      const text = editor.getText().trim();

      setWordCount(
        text ? text.split(/\s+/).length : 0
      );
    },
  });



  useEffect(() => {
    if (!editor || !value) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);


  useEffect(() => {
    if (!editor || !clearTrigger) return;

    editor.commands.setContent("", false);

    setWordCount(0);
  }, [clearTrigger, editor]);

  if (!editor) return null;

  const currentFont =
    editor.getAttributes("textStyle")
      .fontFamily || "";

  return (
    <div
      className="
        overflow-hidden rounded-2xl
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        shadow-xl
      "
    >
      {/* HEADER */}

      <div
        className="
          flex items-center justify-between
          border-b border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800
          px-4 py-2
        "
      >
        <span
          className="
            text-[11px] font-semibold uppercase tracking-wider
            text-gray-500
          "
        >
          Rich Text Editor
        </span>

        <span className="text-[11px] text-gray-400">
          {wordCount}{" "}
          {wordCount === 1 ? "word" : "words"}
        </span>
      </div>

      {/* TOOLBAR */}

      <div
        className="
          flex flex-wrap items-center gap-1
          border-b border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800
          p-2
        "
      >
        {/* Undo / Redo */}

        <ToolBtn
          title="Undo"
          active={false}
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          <Undo className="w-4 h-4" />
        </ToolBtn>

        <ToolBtn
          title="Redo"
          active={false}
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          <Redo className="w-4 h-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* HEADINGS */}

        <Dropdown
          label="Heading"
          icon={<Pilcrow className="w-4 h-4" />}
        >
          {({ close }) => (
            <div>
              {HEADINGS.map(
                ({
                  label,
                  cls,
                  action,
                  isActive,
                }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      action(editor);
                      close();
                    }}
                    className={`
                      block w-full px-4 py-2 text-left transition
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      ${
                        isActive(editor)
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-200"
                      }
                    `}
                  >
                    <span className={cls}>
                      {label}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </Dropdown>

        {/* FONT */}

        <Dropdown
          label="Font"
          icon={<Type className="w-4 h-4" />}
        >
          {({ close }) => (
            <div>
              {FONTS.map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    fontFamily:
                      value || "inherit",
                  }}
                  onClick={() => {
                    value
                      ? editor
                          .chain()
                          .focus()
                          .setFontFamily(value)
                          .run()
                      : editor
                          .chain()
                          .focus()
                          .unsetFontFamily()
                          .run();

                    close();
                  }}
                  className={`
                    block w-full px-4 py-2 text-left transition
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    ${
                      currentFont === value
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </Dropdown>

        {/* COLORS */}

        <Dropdown
          label="Color"
          icon={<Palette className="w-4 h-4" />}
        >
          {({ close }) => (
            <div className="p-3">
              <p
                className="
                  mb-2 text-[10px] font-semibold uppercase tracking-wider
                  text-gray-500
                "
              >
                Text Color
              </p>

              <div className="grid grid-cols-4 gap-2">
                {COLORS.map(
                  ({ name, value }) => (
                    <button
                      key={value}
                      title={name}
                      type="button"
                      style={{
                        backgroundColor: value,
                      }}
                      className="
                        h-7 w-7 rounded-md
                        border-2 border-gray-200
                        transition hover:scale-110
                      "
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .setColor(value)
                          .run();

                        close();
                      }}
                    />
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .unsetColor()
                    .run();

                  close();
                }}
                className="
                  mt-3 w-full rounded-md
                  border border-gray-300 dark:border-gray-600
                  px-2 py-1 text-xs
                  text-gray-600 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700
                "
              >
                Reset Color
              </button>
            </div>
          )}
        </Dropdown>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* STYLE */}

        <ToolBtn
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          <Bold className="w-4 h-4" />
        </ToolBtn>

        <ToolBtn
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          <Italic className="w-4 h-4" />
        </ToolBtn>

        <ToolBtn
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
        >
          <Strikethrough className="w-4 h-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* LISTS */}

        <ToolBtn
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >
          <List className="w-4 h-4" />
        </ToolBtn>

        <ToolBtn
          title="Numbered List"
          active={editor.isActive("orderedList")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >
          <ListOrdered className="w-4 h-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* CODE */}

        <ToolBtn
          title="Code Block"
          active={editor.isActive("codeBlock")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
        >
          <Code className="w-4 h-4" />
        </ToolBtn>

        <ToolBtn
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
        >
          <Quote className="w-4 h-4" />
        </ToolBtn>
      </div>

      {/* CONTENT */}

      <div className="p-4 min-h-[400px] bg-white dark:bg-gray-900">
        <EditorContent
          editor={editor}
          className="tiptap-editor"
        />
      </div>
    </div>
  );
}