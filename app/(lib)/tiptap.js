import { EditorContent } from "@tiptap/react";
import {
    MdOutlineFormatBold,
    MdOutlineFormatItalic,
    MdOutlineFormatUnderlined,
    MdStrikethroughS,
    MdFormatListBulleted,
    MdFormatListNumbered,
} from "react-icons/md";
import {
    FaHighlighter,
    FaAlignCenter,
    FaAlignLeft,
    FaAlignRight,
    FaAlignJustify,
} from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { BsBlockquoteLeft } from "react-icons/bs";

export function Tiptap({ editor }) {
    return (
        <div>
            <div className="flex px-1 gap-[10px] md:flex-row flex-col">
                <div className="flex gap-[10px]">
                    {/* button for heading 1 */}
                    {editor?.isActive("heading", { level: 1 }) ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run();
                            }}
                        >
                            <LuHeading1 size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run();
                            }}
                        >
                            <LuHeading1 size={"1em"} />
                        </div>
                    )}

                    {/* button for heading 2 */}
                    {editor?.isActive("heading", { level: 2 }) ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run();
                            }}
                        >
                            <LuHeading2 size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run();
                            }}
                        >
                            <LuHeading2 size={"1em"} />
                        </div>
                    )}

                    {/* button for heading 3 */}
                    {editor?.isActive("heading", { level: 3 }) ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run();
                            }}
                        >
                            <LuHeading3 size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run();
                            }}
                        >
                            <LuHeading3 size={"1em"} />
                        </div>
                    )}
                </div>

                <div className="flex gap-[10px]">
                    {/* button for bold */}
                    {editor?.isActive("bold") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleBold().run();
                            }}
                        >
                            <MdOutlineFormatBold size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleBold().run();
                            }}
                        >
                            <MdOutlineFormatBold size={"1em"} />
                        </div>
                    )}

                    {/* button of italic */}
                    {editor?.isActive("italic") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleItalic().run();
                            }}
                        >
                            <MdOutlineFormatItalic size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleItalic().run();
                            }}
                        >
                            <MdOutlineFormatItalic size={"1em"} />
                        </div>
                    )}

                    {/* button of underline */}
                    {editor?.isActive("underline") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleUnderline().run();
                            }}
                        >
                            <MdOutlineFormatUnderlined
                                size={"1em"}
                                color="white"
                            />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleUnderline().run();
                            }}
                        >
                            <MdOutlineFormatUnderlined size={"1em"} />
                        </div>
                    )}

                    {/* button of  highlight */}
                    {editor?.isActive("highlight") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleHighlight().run();
                            }}
                        >
                            <FaHighlighter size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleHighlight().run();
                            }}
                        >
                            <FaHighlighter size={"1em"} />
                        </div>
                    )}

                    {/* button of  strikethrough */}
                    {editor?.isActive("strike") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleStrike().run();
                            }}
                        >
                            <MdStrikethroughS size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleStrike().run();
                            }}
                        >
                            <MdStrikethroughS size={"1em"} />
                        </div>
                    )}
                </div>

                <div className="flex gap-[10px]">
                    {/* button for left-align */}
                    {editor?.isActive({ textAlign: "left" }) ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("left")
                                    .run();
                            }}
                        >
                            <FaAlignLeft size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("left")
                                    .run();
                            }}
                        >
                            <FaAlignLeft size={"1em"} />
                        </div>
                    )}

                    {/* button for center-align */}
                    {editor?.isActive({ textAlign: "center" }) ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("center")
                                    .run();
                            }}
                        >
                            <FaAlignCenter size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("center")
                                    .run();
                            }}
                        >
                            <FaAlignCenter size={"1em"} />
                        </div>
                    )}

                    {/* button for right-align */}
                    {editor?.isActive({ textAlign: "right" }) ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("right")
                                    .run();
                            }}
                        >
                            <FaAlignRight size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("right")
                                    .run();
                            }}
                        >
                            <FaAlignRight size={"1em"} />
                        </div>
                    )}

                    {/* button for justify */}
                    {editor?.isActive({ textAlign: "justify" }) ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("justify")
                                    .run();
                            }}
                        >
                            <FaAlignJustify size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("justify")
                                    .run();
                            }}
                        >
                            <FaAlignJustify size={"1em"} />
                        </div>
                    )}
                </div>

                <div className="flex gap-[10px]">
                    {/* button for bulletlist */}
                    {editor?.isActive("bulletList") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleBulletList().run();
                            }}
                        >
                            <MdFormatListBulleted size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleBulletList().run();
                            }}
                        >
                            <MdFormatListBulleted size={"1em"} />
                        </div>
                    )}

                    {/* button for ordered list */}
                    {editor?.isActive("orderedList") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleOrderedList()
                                    .run();
                            }}
                        >
                            <MdFormatListNumbered size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleOrderedList()
                                    .run();
                            }}
                        >
                            <MdFormatListNumbered size={"1em"} />
                        </div>
                    )}

                    {/* button for blockquote */}
                    {editor?.isActive("blockquote") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleBlockquote().run();
                            }}
                        >
                            <BsBlockquoteLeft size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleBlockquote().run();
                            }}
                        >
                            <BsBlockquoteLeft size={"1em"} />
                        </div>
                    )}

                    {/* button for codeblock */}
                    {editor?.isActive("codeBlock") ? (
                        <div
                            className="bg-slate-800 border-2 border-black p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleCodeBlock().run();
                            }}
                        >
                            <FaCode size={"1em"} color="white" />
                        </div>
                    ) : (
                        <div
                            className="border-2 border-[grey] p-[6px] rounded cursor-pointer"
                            onClick={() => {
                                editor.chain().focus().toggleCodeBlock().run();
                            }}
                        >
                            <FaCode size={"1em"} />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
