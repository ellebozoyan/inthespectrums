# Images

Put photographs here. The styling is ready — nothing in this folder yet.

## Before you add one

**Resize to about 1200px wide** and export as **WebP** (or JPEG at ~80%).
A 4MB phone photo makes the page unusable on a slow connection.

**Write the alt text before the caption.** Alt text describes what is in the
picture for somebody who cannot see it. The caption says why it is there.

## How to use one

```html
<figure class="fig">
  <img src="img/kitchen-hands.webp" width="1200" height="800"
       alt="Two pairs of hands tearing lettuce over a bowl on a counter">
  <figcaption>Cooking together counts as feeding work.</figcaption>
</figure>
```

`width` and `height` are required — `check-site.py` fails without them, because
the page jumps as the image loads. Lazy loading, async decoding and aspect
ratio are applied automatically.

## Variants

| Class | What it does |
|---|---|
| `fig` | Full column width. The default. |
| `fig side` | Floats right at 42%, stacks on narrow screens. |
| `fig wide` | Full bleed, for the top of a page. |
| `fig plain` | Skips the slight desaturation. |
| `figrow` | Wrap two or three `fig` blocks to sit side by side. |

## The editorial rule

**Photograph the situation, not the person.** Hands, a counter mid-mess, two
people from behind at a table, a waiting room. A recognisable child's face next
to text about feeding difficulty implies that child has one, and they did not
consent to that.

Save identifiable faces for pages where the implication is safe — community,
siblings, caregivers, the home page. Avoid them on conditions, behavior and
feeding.

Where you want disabled people visibly represented, use **Disabled And Here**
(affecttheverb.com/collection). The people photographed consented specifically
to representing disability, it is CC BY 4.0 — credit "Disabled And Here" with a
link — and the alt text is already written for you.
