import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import type { Text } from "slate";
import { Editor, Transforms } from "slate";

type ModifierKey = Exclude<keyof Text, "type" | "text" | "code">;

const baseCheckIsActive = (editor: Editor, name: ModifierKey) => {
  const marks = Editor.marks(editor);
  if (!marks) {
    return false;
  }

  return Boolean(marks[name]);
};

const baseHandleToggle = (editor: Editor, name: ModifierKey) => {
  const marks = Editor.marks(editor);

  // If there is no selection, set selection to the end of line
  if (!editor.selection) {
    const endOfEditor = Editor.end(editor, []);
    Transforms.select(editor, endOfEditor);
  }

  // Toggle the modifier
  if (marks?.[name]) {
    Editor.removeMark(editor, name);
  } else {
    Editor.addMark(editor, name, true);
  }
};

export type ModifiersStore = {
  [K in ModifierKey]: {
    icon: React.ComponentType;
    isValidEventKey: (event: React.KeyboardEvent<HTMLElement>) => boolean;
    label: string;
    checkIsActive: (editor: Editor) => boolean;
    handleToggle: (editor: Editor) => void;
    renderLeaf: (children: React.JSX.Element | string) => React.JSX.Element;
  };
};

export const modifiers: ModifiersStore = {
  bold: {
    icon: Bold,
    isValidEventKey: (event) => event.key === "b",
    label: "Bold",
    checkIsActive: (editor) => baseCheckIsActive(editor, "bold"),
    handleToggle: (editor) => {
      baseHandleToggle(editor, "bold");
    },
    renderLeaf: (children) => <span className="font-bold">{children}</span>,
  },
  italic: {
    icon: Italic,
    isValidEventKey: (event) => event.key === "i",
    label: "Italic",
    checkIsActive: (editor) => baseCheckIsActive(editor, "italic"),
    handleToggle: (editor) => {
      baseHandleToggle(editor, "italic");
    },
    renderLeaf: (children) => <span className="italic">{children}</span>,
  },
  underline: {
    icon: Underline,
    isValidEventKey: (event) => event.key === "u",
    label: "Underline",
    checkIsActive: (editor) => baseCheckIsActive(editor, "underline"),
    handleToggle: (editor) => {
      baseHandleToggle(editor, "underline");
    },
    renderLeaf: (children) => <span className="underline">{children}</span>,
  },
  strikethrough: {
    icon: Strikethrough,
    isValidEventKey: (event) => event.key === "S" && event.shiftKey,
    label: "Strikethrough",
    checkIsActive: (editor) => baseCheckIsActive(editor, "strikethrough"),
    handleToggle: (editor) => {
      baseHandleToggle(editor, "strikethrough");
    },
    renderLeaf: (children) => <span className="line-through">{children}</span>,
  },
};
