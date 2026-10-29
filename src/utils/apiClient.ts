export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (netErr: any) {
    throw new Error(`Network connection error: ${netErr?.message || 'Failed to reach server'}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    let errorMsg = `Server request failed (${response.status})`;
    if (isJson) {
      try {
        const errObj = await response.json();
        errorMsg = errObj.error || errObj.message || errorMsg;
      } catch {
        // fallback
      }
    } else {
      const rawText = await response.text().catch(() => '');
      if (response.status === 404) {
        errorMsg = `API endpoint '${url}' was not found (404).`;
      } else if (rawText.includes('<!DOCTYPE') || rawText.includes('<html')) {
        errorMsg = `Server returned HTML (${response.status}) instead of expected JSON payload.`;
      } else if (rawText.trim()) {
        errorMsg = rawText.slice(0, 160);
      }
    }
    throw new Error(errorMsg);
  }

  if (!isJson) {
    const rawText = await response.text().catch(() => '');
    if (rawText.includes('<!DOCTYPE') || rawText.includes('<html')) {
      throw new Error(`Received HTML document from '${url}' instead of JSON. Please try again.`);
    }
    try {
      return JSON.parse(rawText) as T;
    } catch {
      throw new Error(`Invalid response format received from '${url}'. Expected JSON.`);
    }
  }

  try {
    return (await response.json()) as T;
  } catch (parseErr: any) {
    throw new Error(`Could not parse JSON response: ${parseErr?.message || 'Syntax Error'}`);
  }
}
