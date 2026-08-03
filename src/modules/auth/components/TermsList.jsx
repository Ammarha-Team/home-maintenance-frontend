// Plain clause list used by the customer terms screen (Figma node 1:602).
// Figma's code export says list-disc, but the frame renders square markers —
// the render wins.
function TermsList({ terms }) {
  return (
    <ul className="list-[square] space-y-[12px] ps-[36px] text-right text-[24px] leading-[1.5] text-text-300">
      {terms.map((term) => (
        <li key={term}>{term}</li>
      ))}
    </ul>
  )
}

export default TermsList
