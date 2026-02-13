import type { CheerioAPI } from "cheerio";

export interface ActionItem {
  name: string;
  description: string;
}

const MAX_ACTIONS = 5;

/**
 * Mapping of common button/link text patterns to snake_case action names.
 * Each entry: [regex pattern, snake_case name, description template]
 */
const ACTION_PATTERNS: [RegExp, string, string][] = [
  [/add\s*to\s*cart/i, "add_to_cart", "Add to shopping cart"],
  [/buy\s*now/i, "purchase", "Buy now"],
  [/purchase/i, "purchase", "Purchase item"],
  [/subscribe/i, "subscribe", "Subscribe"],
  [/sign\s*up/i, "sign_up", "Sign up for an account"],
  [/register/i, "register", "Register"],
  [/download/i, "download", "Download"],
  [/contact\s*(us)?/i, "contact", "Contact"],
  [/book\s*(now)?/i, "book", "Book"],
  [/reserve/i, "book", "Make a reservation"],
  [/rsvp/i, "register", "RSVP for event"],
  [/get\s*started/i, "sign_up", "Get started"],
  [/try\s*(it\s*)?(for\s*)?free/i, "sign_up", "Try for free"],
  [/start\s*(free\s*)?trial/i, "sign_up", "Start free trial"],
  [/log\s*in|sign\s*in/i, "login", "Log in"],
  [/check\s*out/i, "checkout", "Proceed to checkout"],
  [/add\s*to\s*wishlist/i, "add_to_wishlist", "Add to wishlist"],
  [/share/i, "share", "Share"],
  [/compare/i, "compare", "Compare"],
  [/check\s*availability/i, "check_availability", "Check availability"],
  [/apply\s*(now)?/i, "apply", "Apply"],
  [/donate/i, "donate", "Donate"],
  [/learn\s*more/i, "learn_more", "Learn more"],
  [/view\s*details/i, "view_details", "View details"],
  [/request\s*(a\s*)?(demo|quote)/i, "request_demo", "Request a demo or quote"],
];

export function extractActions($: CheerioAPI): ActionItem[] {
  const actions: ActionItem[] = [];
  const seenNames = new Set<string>();

  // Search buttons and submit inputs
  const elements = $(
    "button, input[type='submit'], a[class*='btn'], a[class*='button'], a[role='button'], [class*='cta']"
  );

  elements.each((_, el) => {
    if (actions.length >= MAX_ACTIONS) return false;

    const $el = $(el);
    const text =
      $el.attr("value")?.trim() ||
      $el.text().trim().replace(/\s+/g, " ") ||
      $el.attr("aria-label")?.trim() ||
      "";

    if (!text || text.length > 50) return; // Skip empty or too-long text

    for (const [pattern, name, description] of ACTION_PATTERNS) {
      if (pattern.test(text) && !seenNames.has(name)) {
        seenNames.add(name);
        actions.push({ name, description });
        break; // Only match first pattern per element
      }
    }
  });

  // Also check forms with submit buttons
  if (actions.length < MAX_ACTIONS) {
    $("form").each((_, form) => {
      if (actions.length >= MAX_ACTIONS) return false;

      const $form = $(form);
      const action = $form.attr("action") || "";
      const submitText =
        $form.find("button[type='submit'], input[type='submit']").first().text().trim() ||
        $form.find("button[type='submit'], input[type='submit']").first().attr("value")?.trim() ||
        "";

      // Check form action or submit button text
      const textToCheck = submitText || action;
      for (const [pattern, name, description] of ACTION_PATTERNS) {
        if (pattern.test(textToCheck) && !seenNames.has(name)) {
          seenNames.add(name);
          actions.push({ name, description });
          break;
        }
      }
    });
  }

  return actions;
}
