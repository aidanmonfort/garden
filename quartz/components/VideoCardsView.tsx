import type { ViewRenderer, ViewTypeRegistration, BasesData, BasesEntry, BasesView } from "../../.quartz/plugins/bases-page"

// Inline utilities from @quartz-community/bases-page internal shared/cell
// (not part of the public dist API)

function getNestedValue(value: unknown, path: string[]): unknown {
  let current: unknown = value
  for (const segment of path) {
    if (segment === "") continue
    if (Array.isArray(current)) {
      const index = Number(segment)
      if (Number.isNaN(index)) return undefined
      current = current[index]
      continue
    }
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[segment]
      continue
    }
    return undefined
  }
  return current
}

function resolveEntryPropertyValue(column: string, entry: BasesEntry): unknown {
  if (column.startsWith("note.")) {
    return getNestedValue(entry.properties, column.slice(5).split("."))
  }
  if (column.startsWith("file.")) {
    return getNestedValue(entry.fileProperties, column.slice(5).split("."))
  }
  if (column.startsWith("formula.")) {
    return getNestedValue(entry.formulaValues, column.slice(8).split("."))
  }
  return getNestedValue(entry.properties, column.split("."))
}

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true
  if (Array.isArray(value)) return value.length === 0
  return false
}


const VideoCardsView: ViewRenderer = ({ entries, view, basesData, total }) => {
  const imageProperty = typeof view.image === "string" ? view.image : undefined
  const cardSize = view.cardSize
  const cardAspect = view.cardAspect
  const imageFit = typeof view.imageFit === "string" ? view.imageFit : "cover"

  const gridStyle =
    typeof cardSize === "number" && cardSize > 0
      ? { gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))` }
      : undefined

  return (
    <div class="bases-cards-wrapper">
      <div class="bases-view-meta">
        Showing {entries.length} of {total}
      </div>
      <div class="bases-cards" style={gridStyle}>
        {entries.map((entry) => {
          const imageValue = imageProperty
            ? resolveEntryPropertyValue(imageProperty, entry)
            : undefined
          // Resolve the image src — webp paths are stored as plain strings in frontmatter
          const imageSrc = imageValue && !isEmptyValue(imageValue) ? String(imageValue) : ""
          const imageStyle: Record<string, string> = {}
          if (typeof cardAspect === "number" && cardAspect > 0) {
            imageStyle.aspectRatio = String(cardAspect)
          }
          if (imageFit) {
            imageStyle.objectFit = imageFit
          }

          return (
            <div class="bases-card">
              {imageSrc ? (
                <div class="bases-card-image" style={imageStyle}>
                  <img
                    src={imageSrc}
                    alt={entry.title}
                    loading="lazy"
                    style={{ objectFit: imageFit as "cover" | "contain" | "fill" | "none" | "scale-down" }}
                  />
                </div>
              ) : (
                <div class="bases-card-image bases-card-image--placeholder" style={imageStyle} />
              )}
              <div class="bases-card-body">
                <a href={`/${entry.slug}`} class="internal" data-slug={entry.slug}>
                  {entry.title}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const videoCardsViewRegistration: ViewTypeRegistration = {
  id: "video-cards",
  name: "Video Cards",
  icon: "layout-grid",
  render: VideoCardsView,
  css: `
.bases-card-image--placeholder {
  background: var(--gray);
  min-height: 120px;
}
.bases-card-image img {
  width: 100%;
  height: 100%;
}
`,
}
