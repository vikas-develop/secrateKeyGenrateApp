/**
 * Export utilities for downloading secrets
 */

export interface ExportOptions {
  format: 'txt' | 'json';
  includeMetadata?: boolean;
}

/**
 * Download text content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export a single secret
 */
export function exportSecret(
  secret: string,
  algorithm: string,
  options: ExportOptions = { format: 'txt', includeMetadata: true }
) {
  const timestamp = new Date().toISOString();
  const filename = `secret-${algorithm}-${Date.now()}.${options.format}`;

  if (options.format === 'json') {
    const data = {
      secret,
      algorithm,
      timestamp,
      exportedAt: new Date().toISOString(),
    };
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  } else {
    let content = '';
    if (options.includeMetadata) {
      content = `Secret Generator Export\n`;
      content += `Algorithm: ${algorithm}\n`;
      content += `Generated: ${timestamp}\n`;
      content += `Exported: ${new Date().toISOString()}\n`;
      content += `\n${'='.repeat(50)}\n\n`;
    }
    content += secret;
    downloadFile(content, filename, 'text/plain');
  }
}

/**
 * Export multiple secrets (history)
 */
export function exportHistory(
  secrets: Array<{
    id: string;
    secret: string;
    algorithm: string;
    timestamp: number;
    strength?: {
      score: number;
      strength: string;
      entropy: number;
    };
  }>,
  options: ExportOptions = { format: 'json', includeMetadata: true }
) {
  const timestamp = new Date().toISOString();
  const filename = `secret-history-${Date.now()}.${options.format}`;

  if (options.format === 'json') {
    const data = {
      exportedAt: timestamp,
      totalSecrets: secrets.length,
      secrets: secrets.map((item) => ({
        id: item.id,
        secret: item.secret,
        algorithm: item.algorithm,
        timestamp: item.timestamp,
        generatedAt: new Date(item.timestamp).toISOString(),
        strength: item.strength,
      })),
    };
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  } else {
    let content = `Secret Generator - History Export\n`;
    content += `Exported: ${timestamp}\n`;
    content += `Total Secrets: ${secrets.length}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    secrets.forEach((item, index) => {
      content += `[${index + 1}] ${item.algorithm.toUpperCase()}\n`;
      if (options.includeMetadata) {
        content += `Generated: ${new Date(item.timestamp).toISOString()}\n`;
        if (item.strength) {
          content += `Strength: ${item.strength.strength} (Score: ${item.strength.score}/100, Entropy: ${item.strength.entropy} bits)\n`;
        }
        content += `\n`;
      }
      content += `${item.secret}\n`;
      content += `\n${'-'.repeat(60)}\n\n`;
    });

    downloadFile(content, filename, 'text/plain');
  }
}

/**
 * Copy multiple secrets to clipboard
 */
export async function copyMultipleSecrets(secrets: string[]): Promise<void> {
  const text = secrets.join('\n');
  await navigator.clipboard.writeText(text);
}

/**
 * Export batch generated secrets
 */
export function exportBatchSecrets(
  secrets: Array<{ id: string; secret: string; algorithm: string; timestamp: number }>,
  options: ExportOptions = { format: 'json', includeMetadata: true }
) {
  const timestamp = new Date().toISOString();
  const filename = `batch-secrets-${Date.now()}.${options.format}`;

  if (options.format === 'json') {
    const data = {
      exportedAt: timestamp,
      totalSecrets: secrets.length,
      algorithm: secrets[0]?.algorithm || 'unknown',
      secrets: secrets.map((item, index) => ({
        id: item.id,
        index: index + 1,
        secret: item.secret,
        algorithm: item.algorithm,
        timestamp: item.timestamp,
        generatedAt: new Date(item.timestamp).toISOString(),
      })),
    };
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  } else {
    let content = `Secret Generator - Batch Export\n`;
    content += `Exported: ${timestamp}\n`;
    content += `Algorithm: ${secrets[0]?.algorithm || 'unknown'}\n`;
    content += `Total Secrets: ${secrets.length}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    secrets.forEach((item, index) => {
      if (options.includeMetadata) {
        content += `[${index + 1}] Generated: ${new Date(item.timestamp).toISOString()}\n`;
        content += `\n`;
      }
      content += `${item.secret}\n`;
      content += `\n${'-'.repeat(60)}\n\n`;
    });

    downloadFile(content, filename, 'text/plain');
  }
}

