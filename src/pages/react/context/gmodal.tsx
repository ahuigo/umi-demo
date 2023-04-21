import ReactDOM, { Root } from "react-dom/client";
let modalRoot: Root;
export function gmodal(children: React.ReactElement, id = 'modal-root-demo') {
  let modalDiv = document.getElementById(id)!;
  if (!modalDiv) {
    modalDiv = document.createElement('div');
    modalDiv.id = id;
    document.body.appendChild(modalDiv);
  }

  if (!modalRoot) {
    modalRoot = ReactDOM.createRoot(modalDiv);
  }
  // return createPortal(children, el);
  // const dom = <ThemeContext.Provider value={{ count: 2 }}>{children}</ThemeContext.Provider>;
  const dom = children;
  modalRoot.render(dom);
}