export function mockUid(ids: any[]): void {
  ids.forEach((id) => (window.crypto.randomUUID as any).mockImplementationOnce(() => id))
}
