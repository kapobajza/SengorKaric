import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import userEvent from "@testing-library/user-event";

import { RichTextEditor } from "./rich-text-editor";

describe("rich text editor component", () => {
  test("should render with empty paragraph without initial value", () => {
    const screen = render(<RichTextEditor />);

    const editor = screen.getByRole("textbox");
    const emptySlateNode = editor.getByRole("paragraph").query();

    expect(editor.query()).toBeInTheDocument();
    expect(emptySlateNode).toBeInTheDocument();
    expect(emptySlateNode).toHaveAttribute("data-slate-node", "element");
    expect(emptySlateNode).toHaveTextContent("");
  });

  test("should render with initial value", () => {
    const screen = render(
      <RichTextEditor
        initialValue={[
          { type: "paragraph", children: [{ text: "test", type: "text" }] },
        ]}
      />,
    );

    const editor = screen.getByRole("textbox");
    const slateNode = editor.getByRole("paragraph").query();

    expect(editor.query()).toBeInTheDocument();
    expect(slateNode).toBeInTheDocument();
    expect(slateNode).toHaveAttribute("data-slate-node", "element");
    expect(slateNode).toHaveTextContent("test");
  });

  test("should work when using text align with non-paragraph nodes", async () => {
    const screen = render(
      <RichTextEditor
        initialValue={[
          {
            type: "heading",
            children: [{ text: "Heading 2 test", type: "text" }],
            level: 2,
          },
        ]}
      />,
    );

    const alignCenterButton = screen.getByRole("radio", {
      name: /align center/i,
    });
    const editor = screen.getByRole("textbox");
    const testHeading = editor
      .getByRole("heading", { level: 2, name: /heading 2 test/i })
      .query();

    await editor.click();
    await alignCenterButton.click();

    expect(editor.query()).toBeInTheDocument();
    expect(testHeading).toBeInTheDocument();
    expect(testHeading).toHaveAttribute(
      "class",
      expect.stringContaining("text-center"),
    );
  });

  test("should start with a list item if initial value is a list", async () => {
    const screen = render(<RichTextEditor />);

    const editor = screen.getByRole("textbox");
    const editorElement = editor.query();

    if (!editorElement) {
      throw new Error("Editor element not found");
    }

    await userEvent.type(editorElement, "1. text{enter}text{enter}{enter}text");

    screen.debug(editor);

    const li = editorElement.querySelectorAll("li");
    expect(li).toHaveLength(2);

    await editor.clear();

    const emptyPargraphNode = editor.getByRole("paragraph").query();
    const listNode = editor.getByRole("list").query();
    const listItemNode = listNode?.querySelector("li");

    expect(editorElement).toBeInTheDocument();
    expect(listItemNode).toBeInTheDocument();
    expect(emptyPargraphNode).not.toBeInTheDocument();
  });
});
