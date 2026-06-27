# Panduan Penggunaan Komponen Reusable

Dokumen ini menjelaskan cara menggunakan komponen reusable yang telah dibuat: `DataTable` dan `ImportExcelModal`. Kedua komponen ini dirancang menggunakan fitur Svelte 5 terbaru (Runes & Snippets) agar fleksibel, berkinerja tinggi, dan mudah diintegrasikan dengan berbagai struktur data.

---

## 1. DataTable.svelte

Komponen **`DataTable`** digunakan untuk menampilkan daftar data dalam bentuk tabel maupun grid kartu secara dinamis, lengkap dengan pencarian, pemilahan baris per halaman, pagination, filter kustom, serta aksi massal (bulk actions).

### Lokasi Impor
```typescript
import DataTable from '$components/DataTable.svelte';
// Atau jika menggunakan absolute/relative path:
import DataTable from '../../../components/DataTable.svelte';
```

### Properti (Props) & Bindings

| Properti | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `items` | `any[]` | Array data yang telah difilter oleh komponen induk (misal hasil search/filter). |
| `totalItemsCount` | `number` | Jumlah keseluruhan data sebelum difilter (untuk penunjuk *"Showing X to Y of Z"*). |
| `columns` | `Column[]` | Array berisi struktur kolom `{ key: string, label: string, class?: string }`. |
| `selectedIds` | `any[]` (bindable) | Array untuk menampung ID baris yang dicentang (dipilih). |
| `searchQuery` | `string` (bindable) | String kueri pencarian yang diikat ke kolom input pencarian. |
| `pageSize` | `'5' \| '10' \| '50' \| 'All'` (bindable) | Jumlah item per halaman. |
| `currentPage` | `number` (bindable) | Halaman aktif saat ini. |
| `viewMode` | `'table' \| 'card'` (bindable) | Mode tampilan tabel (`table`) atau grid kartu (`card`). |
| `searchPlaceholder` | `string` (opsional) | Placeholder untuk input teks pencarian. Default: `"Cari..."`. |
| `filterLabel` | `string` (opsional) | Label tombol filter dropdown. Default: `"Filter"`. |
| `filterDropdownOpen`| `boolean` (bindable) | Mengatur status buka/tutup dropdown filter. |

### Snippets Pendukung (Svelte 5)

Komponen ini memanfaatkan **Snippets** untuk memberikan kendali kustomisasi markup 100% kepada file induk:

1. **`{#snippet filterOptions()}`**
   Merender konten dropdown filter (opsional).
2. **`{#snippet row(item, isSelected, toggleSelect)}`**
   Merender baris tubuh tabel `<tr>`. Menerima 3 argumen: objek `item`, boolean `isSelected`, dan fungsi pemicu centang `toggleSelect`.
3. **`{#snippet card(item, isSelected, toggleSelect)}`**
   Merender tampilan grid kartu saat `viewMode === 'card'`.
4. **`{#snippet batchActions(selectedCount, clearSelection)}`**
   Merender baris tombol aksi kolektif saat ada baris yang dipilih (misal: tombol hapus massal).

---

### Contoh Implementasi Lengkap (Halaman Produk)

Berikut adalah contoh lengkap cara membuat halaman admin data **Produk** menggunakan `DataTable.svelte`:

```html
<script lang="ts">
	import DataTable from '../../../components/DataTable.svelte';
	import { invalidateAll } from '$app/navigation';

	// 1. Data mentah dari loader (+page.server.ts)
	let { data } = $props();

	// 2. State DataTable
	let searchQuery = $state('');
	let categoryFilter = $state('Semua');
	let filterDropdownOpen = $state(false);
	
	let viewMode = $state<'table' | 'card'>('table');
	let pageSize = $state<'5' | '10' | '50' | 'All'>('10');
	let currentPage = $state(1);
	let selectedIds = $state<number[]>([]);

	// 3. Logika Filter data produk di parent
	let filteredProducts = $derived(
		data.products?.filter((p: any) => {
			const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
			                      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = categoryFilter === 'Semua' || p.category === categoryFilter;
			return matchesSearch && matchesCategory;
		}) || []
	);

	function handleBulkDelete() {
		alert(`Menghapus ${selectedIds.length} produk terpilih`);
		selectedIds = []; // clear selection
	}
</script>

<!-- Dropdown opsi filter kategori -->
{#snippet filterOptions()}
	{#each ['Semua', 'Elektronik', 'Pakaian', 'Makanan'] as cat}
		<button
			onclick={() => {
				categoryFilter = cat;
				filterDropdownOpen = false;
			}}
			class="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors {categoryFilter === cat ? 'text-amber-500 font-bold' : 'text-slate-600'}"
		>
			{cat}
		</button>
	{/each}
{/snippet}

<!-- Rendering baris tabel kustom -->
{#snippet row(product: any, isSelected: boolean, toggleSelect: () => void)}
	<tr class="hover:bg-slate-50/50 transition-colors {isSelected ? 'bg-amber-50/20' : ''}">
		<td class="px-6 py-4 text-center">
			<input type="checkbox" checked={isSelected} onchange={toggleSelect} class="rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
		</td>
		<td class="px-6 py-4 font-bold text-slate-800">{product.name}</td>
		<td class="px-6 py-4 text-slate-500 font-mono">{product.sku}</td>
		<td class="px-6 py-4 text-slate-600">{product.category}</td>
		<td class="px-6 py-4 font-bold text-emerald-600">Rp {product.price.toLocaleString('id-ID')}</td>
		<td class="px-6 py-4 text-center">
			<a href="/admin/products/edit/{product.id}" class="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg">EDIT</a>
		</td>
	</tr>
{/snippet}

<!-- Rendering grid kartu kustom -->
{#snippet card(product: any, isSelected: boolean, toggleSelect: () => void)}
	<div class="bg-white border rounded-2xl p-5 relative hover:border-amber-400 transition-all {isSelected ? 'border-amber-400 bg-amber-50/10' : 'border-slate-200'}">
		<div class="flex items-center justify-between mb-3">
			<input type="checkbox" checked={isSelected} onchange={toggleSelect} class="rounded text-amber-500" />
			<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">{product.category}</span>
		</div>
		<h3 class="font-bold text-slate-800 text-sm truncate">{product.name}</h3>
		<p class="text-xs text-slate-400 font-mono mt-1">{product.sku}</p>
		<p class="font-bold text-emerald-600 text-xs mt-3">Rp {product.price.toLocaleString('id-ID')}</p>
	</div>
{/snippet}

<!-- Tombol aksi massal -->
{#snippet batchActions(selectedCount: number, clearSelection: () => void)}
	<button onclick={handleBulkDelete} class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
		Hapus Terpilih ({selectedCount})
	</button>
{/snippet}

<!-- Pasang DataTable -->
<div class="p-6">
	<DataTable
		items={filteredProducts}
		totalItemsCount={data.products?.length || 0}
		columns={[
			{ key: 'name', label: 'Nama Produk' },
			{ key: 'sku', label: 'SKU' },
			{ key: 'category', label: 'Kategori' },
			{ key: 'price', label: 'Harga' },
			{ key: 'actions', label: 'Aksi', class: 'text-center w-24' }
		]}
		bind:selectedIds
		bind:searchQuery
		bind:pageSize
		bind:currentPage
		bind:viewMode
		bind:filterDropdownOpen
		filterLabel="Kategori: {categoryFilter}"
		{filterOptions}
		{row}
		{card}
		{batchActions}
	/>
</div>
```

---

## 2. ImportExcelModal.svelte

Komponen **`ImportExcelModal`** membungkus modal impor data berformat CSV/Excel yang dilengkapi dengan visual stepper (Unggah, Review, dan Proses), pengunduh berkas template resmi, filter review, validasi error (deteksi sel kosong, password minimal 6 karakter, email tidak valid, email kembar dalam berkas, dan email yang sudah terdaftar di database), serta baris progress melingkar hijau selama proses insert ke database.

### Lokasi Impor
```typescript
import ImportExcelModal from '$components/ImportExcelModal.svelte';
// Atau jika menggunakan absolute/relative path:
import ImportExcelModal from '../../../components/ImportExcelModal.svelte';
```

### Properti (Props) & Bindings

| Properti | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `show` | `boolean` (bindable) | Status tampil/sembunyi modal. |
| `existingUsers` | `any[]` | Array user aktif dari database (untuk validasi duplikasi email/username). |
| `onSuccess` | `() => Promise<void> \| void` | Callback asinkronus yang dipanggil setelah seluruh data berhasil diimpor. |

---

### Contoh Implementasi Lengkap (Halaman Users)

Berikut adalah contoh pemanggilan `ImportExcelModal` pada file induk Svelte:

```html
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ImportExcelModal from '../../../components/ImportExcelModal.svelte';

	let { data } = $props();
	let showImportModal = $state(false);

	async function handleSuccess() {
		// Segarkan data halaman agar tabel induk menampilkan user baru
		await invalidateAll();
	}
</script>

<!-- Tombol pemicu buka modal -->
<button 
	onclick={() => (showImportModal = true)} 
	class="px-5 py-3 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center gap-2"
>
	📥 Import Excel/CSV
</button>

<!-- Komponen Import Excel -->
<ImportExcelModal
	bind:show={showImportModal}
	existingUsers={data.users}
	onSuccess={handleSuccess}
/>
```

---

> [!TIP]
> **Tips Validasi Impor**: Komponen `ImportExcelModal` secara otomatis membandingkan isian kolom `Username (Email)` dan `Email` dalam file CSV terhadap daftar email yang dikirim lewat prop `existingUsers`. Pastikan prop `existingUsers` selalu terisi dengan data pengguna terbaru dari database Anda untuk memastikan review duplikasi berjalan akurat di sisi klien sebelum data dikirim ke server.
