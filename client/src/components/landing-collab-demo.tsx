"use client";

import { useEffect, useRef } from "react";

const COLORS: Record<string, string> = {
  joe: "oklch(0.55 0.16 280)",
  candice: "oklch(0.62 0.16 25)",
};
const LABELS: Record<string, string> = { joe: "Joe", candice: "Candice" };
const INITIAL_TEXT =
  "Q3 launch brief\n\nShip the beta by August 14. Pair the announcement with a short blog post.\n\nFollowups:";

type UserKey = "joe" | "candice";

function getOther(user: UserKey): UserKey {
  return user === "joe" ? "candice" : "joe";
}

export default function LandingCollabDemo() {
  const editorRefs = useRef<Record<UserKey, HTMLDivElement | null>>({
    joe: null,
    candice: null,
  });
  const cardRefs = useRef<Record<UserKey, HTMLDivElement | null>>({
    joe: null,
    candice: null,
  });
  const statusRefs = useRef<Record<UserKey, HTMLSpanElement | null>>({
    joe: null,
    candice: null,
  });
  const caretRefs = useRef<Record<UserKey, HTMLDivElement | null>>({
    joe: null,
    candice: null,
  });
  const resumeBtnRef = useRef<HTMLButtonElement | null>(null);
  const st = useRef({
    text: INITIAL_TEXT,
    cursors: { joe: INITIAL_TEXT.length, candice: 0 } as Record<UserKey, number>,
    activeUser: null as UserKey | null,
    runId: 0,
  });

  useEffect(() => {
    const editors = editorRefs.current;
    const cards = cardRefs.current;
    const statuses = statusRefs.current;
    const carets = caretRefs.current;

    if (!editors.joe || !editors.candice) return;

    // Wire up caret colors and labels
    (["joe", "candice"] as UserKey[]).forEach((viewer) => {
      const caretEl = carets[viewer];
      const other = getOther(viewer);
      if (caretEl) {
        caretEl.style.color = COLORS[other];
        const label = caretEl.querySelector<HTMLElement>(".dp-caret-label");
        if (label) {
          label.textContent = LABELS[other];
          label.style.background = COLORS[other];
        }
      }
    });

    function getCaretOffset(el: HTMLElement): number {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return 0;
      const range = sel.getRangeAt(0);
      if (!el.contains(range.endContainer)) return 0;
      const pre = range.cloneRange();
      pre.selectNodeContents(el);
      pre.setEnd(range.endContainer, range.endOffset);
      return pre.toString().length;
    }

    function setCaretOffset(el: HTMLElement, offset: number): void {
      const sel = window.getSelection();
      if (!sel) return;
      if (!el.firstChild) {
        const r = document.createRange();
        r.setStart(el, 0);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
        return;
      }
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      let acc = 0;
      let target: { node: Node; off: number } | null = null;
      while ((node = walker.nextNode())) {
        const len = (node as Text).textContent!.length;
        if (acc + len >= offset) {
          target = { node, off: Math.max(0, offset - acc) };
          break;
        }
        acc += len;
        target = { node, off: len };
      }
      const r = document.createRange();
      if (target) r.setStart(target.node, target.off);
      else {
        r.selectNodeContents(el);
        r.collapse(false);
      }
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    }

    function positionRemoteCaret(
      editorEl: HTMLElement,
      caretEl: HTMLElement,
      offset: number
    ): void {
      if (!editorEl.firstChild) {
        caretEl.style.display = "block";
        caretEl.style.left =
          (parseInt(getComputedStyle(editorEl).paddingLeft) || 20) + "px";
        caretEl.style.top =
          (parseInt(getComputedStyle(editorEl).paddingTop) || 16) + "px";
        caretEl.style.height = "18px";
        return;
      }
      const walker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      let acc = 0;
      let target: { node: Node; off: number } | null = null;
      while ((node = walker.nextNode())) {
        const len = (node as Text).textContent!.length;
        if (acc + len >= offset) {
          target = { node, off: Math.max(0, Math.min(len, offset - acc)) };
          break;
        }
        acc += len;
      }
      if (!target) {
        const w2 = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT);
        let last: Node | null = null;
        let n: Node | null;
        while ((n = w2.nextNode())) last = n;
        if (last)
          target = { node: last, off: (last as Text).textContent!.length };
      }
      if (!target) { caretEl.style.display = "none"; return; }
      const range = document.createRange();
      range.setStart(target.node, target.off);
      range.setEnd(target.node, target.off);
      const rect = range.getBoundingClientRect();
      const wrap = editorEl.parentElement!;
      const wrapRect = wrap.getBoundingClientRect();
      let h = rect.height;
      if (!h || h < 4) h = 18;
      caretEl.style.display = "block";
      caretEl.style.left = rect.left - wrapRect.left + "px";
      caretEl.style.top = rect.top - wrapRect.top + "px";
      caretEl.style.height = h + "px";
    }

    function render() {
      const { text, cursors, activeUser } = st.current;
      (["joe", "candice"] as UserKey[]).forEach((user) => {
        if (activeUser !== user && editors[user]) {
          editors[user]!.textContent = text;
        }
      });
      (["joe", "candice"] as UserKey[]).forEach((user) => {
        const other = getOther(user);
        if (carets[user] && editors[user]) {
          positionRemoteCaret(editors[user]!, carets[user]!, cursors[other]);
        }
      });
      (["joe", "candice"] as UserKey[]).forEach((user) => {
        if (statuses[user]) {
          statuses[user]!.textContent =
            activeUser === user
              ? "you · typing"
              : activeUser
                ? "live · view-only"
                : "auto-typing";
        }
      });
    }

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const runActive = (id: number) =>
      id === st.current.runId && st.current.activeUser === null;

    async function moveTo(user: UserKey, offset: number, id: number): Promise<boolean> {
      st.current.cursors[user] = Math.max(0, Math.min(st.current.text.length, offset));
      render();
      await sleep(180);
      return runActive(id);
    }

    async function typeAs(user: UserKey, text: string, id: number, delay = 65): Promise<boolean> {
      for (const ch of text) {
        if (!runActive(id)) return false;
        const pos = st.current.cursors[user];
        st.current.text = st.current.text.slice(0, pos) + ch + st.current.text.slice(pos);
        st.current.cursors[user] = pos + 1;
        const other = getOther(user);
        if (st.current.cursors[other] >= pos) st.current.cursors[other] += 1;
        render();
        await sleep(delay + Math.random() * 25);
      }
      return true;
    }

    async function deleteAs(user: UserKey, count: number, id: number, delay = 45): Promise<boolean> {
      for (let i = 0; i < count; i++) {
        if (!runActive(id)) return false;
        const pos = st.current.cursors[user];
        if (pos <= 0) break;
        st.current.text = st.current.text.slice(0, pos - 1) + st.current.text.slice(pos);
        st.current.cursors[user] = pos - 1;
        const other = getOther(user);
        if (st.current.cursors[other] >= pos) st.current.cursors[other] -= 1;
        render();
        await sleep(delay);
      }
      return true;
    }

    async function runAnimation() {
      const id = ++st.current.runId;
      while (runActive(id)) {
        if (!(await moveTo("joe", st.current.text.length, id))) return;
        await sleep(600);
        if (!(await typeAs("joe", "\n— Draft launch tweet thread", id, 55))) return;
        await sleep(900);

        const idx = st.current.text.indexOf("August 14");
        if (idx >= 0) {
          if (!(await moveTo("candice", idx + 9, id))) return;
          await sleep(400);
          if (!(await deleteAs("candice", 2, id, 55))) return;
          if (!(await typeAs("candice", "21", id, 90))) return;
        }
        await sleep(900);

        if (!(await moveTo("joe", st.current.text.length, id))) return;
        await sleep(500);
        if (!(await typeAs("joe", "\n— Brief sales on positioning", id, 55))) return;
        await sleep(900);

        const idx2 = st.current.text.indexOf("August 21");
        if (idx2 >= 0) {
          if (!(await moveTo("candice", idx2 + 9, id))) return;
          await sleep(400);
          if (!(await typeAs("candice", " (Pacific)", id, 70))) return;
        }
        await sleep(1800);

        if (!runActive(id)) return;
        st.current.text = INITIAL_TEXT;
        st.current.cursors.joe = INITIAL_TEXT.length;
        st.current.cursors.candice = 0;
        render();
        await sleep(1400);
      }
    }

    function activate(user: UserKey) {
      if (st.current.activeUser === user) return;
      st.current.runId++;
      st.current.activeUser = user;
      const other = getOther(user);
      if (!editors[user] || !editors[other]) return;
      editors[user]!.textContent = st.current.text;
      editors[user]!.setAttribute("contenteditable", "true");
      editors[other]!.setAttribute("contenteditable", "false");
      cards[user]?.classList.add("is-active");
      cards[other]?.classList.remove("is-active");
      requestAnimationFrame(() => {
        editors[user]!.focus();
        setCaretOffset(editors[user]!, st.current.cursors[user]);
        render();
      });
    }

    function deactivate() {
      st.current.activeUser = null;
      cards.joe?.classList.remove("is-active");
      cards.candice?.classList.remove("is-active");
      editors.joe?.setAttribute("contenteditable", "false");
      editors.candice?.setAttribute("contenteditable", "false");
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      st.current.text = INITIAL_TEXT;
      st.current.cursors.joe = INITIAL_TEXT.length;
      st.current.cursors.candice = 0;
      render();
      runAnimation();
    }

    const cleanups: (() => void)[] = [];

    (["joe", "candice"] as UserKey[]).forEach((user) => {
      const card = cards[user];
      const editor = editors[user];
      if (!card || !editor) return;

      const onMouseDown = (e: MouseEvent) => {
        if (st.current.activeUser !== user) {
          e.preventDefault();
          activate(user);
          requestAnimationFrame(() => {
            const r = document.caretRangeFromPoint?.(e.clientX, e.clientY);
            if (r && editor.contains(r.startContainer)) {
              const sel = window.getSelection();
              if (sel) {
                sel.removeAllRanges();
                sel.addRange(r);
                st.current.cursors[user] = getCaretOffset(editor);
                render();
              }
            }
          });
        }
      };

      const onInput = () => {
        if (st.current.activeUser !== user) return;
        const oldText = st.current.text;
        let newText = editor.innerText.replace(/ /g, " ");
        if (newText.endsWith("\n") && !oldText.endsWith("\n"))
          newText = newText.slice(0, -1);

        let editOffset = 0;
        const minLen = Math.min(oldText.length, newText.length);
        while (editOffset < minLen && oldText[editOffset] === newText[editOffset])
          editOffset++;
        const delta = newText.length - oldText.length;

        st.current.text = newText;
        st.current.cursors[user] = getCaretOffset(editor);

        const other = getOther(user);
        if (st.current.cursors[other] >= editOffset) {
          st.current.cursors[other] = Math.max(
            editOffset,
            Math.min(newText.length, st.current.cursors[other] + delta)
          );
        }

        if (editors[other]) editors[other]!.textContent = newText;
        if (carets[other] && editors[other])
          positionRemoteCaret(editors[other]!, carets[other]!, st.current.cursors[user]);
        if (carets[user])
          positionRemoteCaret(editor, carets[user]!, st.current.cursors[other]);

        if (statuses[user]) statuses[user]!.textContent = "you · typing";
        if (statuses[other]) statuses[other]!.textContent = "live · view-only";
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const sel = window.getSelection();
          if (!sel || !sel.rangeCount) return;
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const tn = document.createTextNode("\n");
          range.insertNode(tn);
          range.setStartAfter(tn);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          editor.dispatchEvent(new Event("input"));
        }
      };

      card.addEventListener("mousedown", onMouseDown);
      editor.addEventListener("input", onInput);
      editor.addEventListener("keydown", onKeyDown);
      cleanups.push(
        () => card.removeEventListener("mousedown", onMouseDown),
        () => editor.removeEventListener("input", onInput),
        () => editor.removeEventListener("keydown", onKeyDown)
      );
    });

    const onSelectionChange = () => {
      const user = st.current.activeUser;
      if (!user) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const editorEl = editors[user];
      if (!editorEl || !editorEl.contains(sel.anchorNode)) return;
      const off = getCaretOffset(editorEl);
      if (off === st.current.cursors[user]) return;
      st.current.cursors[user] = off;
      const other = getOther(user);
      if (editors[other] && carets[other])
        positionRemoteCaret(editors[other]!, carets[other]!, st.current.cursors[user]);
    };
    document.addEventListener("selectionchange", onSelectionChange);
    cleanups.push(() => document.removeEventListener("selectionchange", onSelectionChange));

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(render, 60); };
    window.addEventListener("resize", onResize);
    cleanups.push(() => { clearTimeout(rt); window.removeEventListener("resize", onResize); });

    const resumeBtn = resumeBtnRef.current;
    resumeBtn?.addEventListener("click", deactivate);
    cleanups.push(() => resumeBtn?.removeEventListener("click", deactivate));

    editors.joe.textContent = INITIAL_TEXT;
    editors.candice.textContent = INITIAL_TEXT;
    render();
    const bootTimer = setTimeout(() => { render(); runAnimation(); }, 60);
    cleanups.push(() => { clearTimeout(bootTimer); st.current.runId++; });

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section id="live" className="relative py-20 md:py-24 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
          <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight leading-[1.1] mb-3 text-balance">
            Two windows, one document.
          </h2>
          <p className="text-muted-foreground md:text-lg text-pretty">
            Joe and Candice are typing into the same doc. Click either card to
            take over — the other side will see your cursor live.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-4">
          {(["joe", "candice"] as UserKey[]).map((user) => (
            <div
              key={user}
              ref={(el) => { cardRefs.current[user] = el; }}
              className="dp-live-card relative rounded-xl border border-border bg-card overflow-hidden transition cursor-text"
            >
              <header className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
                  style={{ background: COLORS[user] }}
                >
                  {LABELS[user][0]}
                </span>
                <span className="font-medium text-sm">{LABELS[user]}</span>
                <span
                  ref={(el) => { statusRefs.current[user] = el; }}
                  className="ml-auto text-[10px] text-muted-foreground font-mono"
                >
                  auto-typing
                </span>
              </header>
              <div className="relative">
                <div
                  ref={(el) => { editorRefs.current[user] = el; }}
                  className="px-5 py-4 text-[13px] leading-[1.7] min-h-[220px] outline-none whitespace-pre-wrap break-words cursor-text"
                  suppressContentEditableWarning
                />
                <div
                  ref={(el) => { caretRefs.current[user] = el; }}
                  className="dp-remote-caret"
                  style={{ display: "none", height: "18px" }}
                >
                  <span className="dp-caret-label" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Click a card to take over typing
          </span>
          <span className="text-muted-foreground/40">·</span>
          <button
            ref={resumeBtnRef}
            className="underline decoration-foreground/30 underline-offset-2 hover:text-foreground"
          >
            resume demo
          </button>
        </div>
      </div>
    </section>
  );
}
