profile_slug:
  String(form.get('email') || '')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') +
  '-' +
  Date.now(),
