// Status badge component - paste this where you render status in admin/assets.js

// Add this function inside your component:
/*
async function changeStatus(assetId, currentStatus) {
  const order = ['pending', 'approved', 'live', 'paused', 'rejected'];
  const options = order.filter(s => s !== currentStatus);
  const next = prompt(
    `Current: ${currentStatus}\nChange to:\n${options.map((s,i) => `${i+1}. ${s}`).join('\n')}\n\nEnter number:`,
  );
  if (!next) return;
  const chosen = options[parseInt(next) - 1];
  if (!chosen) return;
  
  const res = await fetch(`/api/admin/assets/${assetId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: chosen })
  });
  if (res.ok) {
    setAssets(prev => prev.map(a => a._id === assetId ? { ...a, status: chosen } : a));
    alert(`Status changed to: ${chosen}`);
  }
}
*/

// Replace your status badge with:
/*
<button
  onClick={() => changeStatus(asset._id, asset.status)}
  style={{
    background: asset.status === 'live' ? '#064e3b' : asset.status === 'approved' ? '#1e3a5f' : asset.status === 'rejected' ? '#450a0a' : '#1c1c1c',
    color: asset.status === 'live' ? '#4ade80' : asset.status === 'approved' ? '#60a5fa' : asset.status === 'rejected' ? '#f87171' : '#888',
    border: `1px solid ${asset.status === 'live' ? '#065f46' : asset.status === 'approved' ? '#1d4ed8' : asset.status === 'rejected' ? '#7f1d1d' : '#333'}`,
    borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
  }}
  title="Click to change status"
>
  {asset.status} ✎
</button>
*/
