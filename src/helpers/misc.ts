export const formatCategoryLabel = (category: string) => {
    return category
        .split('_')
        .join(' ')
        .replace(/\b(\w)/g, char => char.toUpperCase());
};

export function detectFormat(input:string): string {
    const markdownPattern = /(^|\n)(\*\*|__|\*|_|`|#|-|\[.*?\]\(.*?\))/; // Matches Markdown patterns
    const htmlPattern = /<\/?[a-z][\s\S]*>/i; // Matches HTML tags
    const codeBlockPattern = /```[\s\S]*?```|`[\s\S]*?`/; // Matches Markdown code blocks

    // Check for Markdown code blocks or inline code
    if (codeBlockPattern.test(input)) {
        // If it has code blocks, assume Markdown
        return "Markdown";
    }

    // Check for Markdown patterns
    if (markdownPattern.test(input)) {
        return "Markdown";
    }

    // Check for HTML tags
    if (htmlPattern.test(input)) {
        return "HTML";
    }

    // Default to unknown
    return "Unknown";
}