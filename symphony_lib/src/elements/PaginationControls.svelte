<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let instancesPerPage: number;
  export let size: number;
  export let page = 0;

  $: maxPage = Math.ceil(size / instancesPerPage);
</script>

<div class="pt-2 flex items-center justify-between">
  <div class="sm:flex-1 sm:flex sm:items-center sm:justify-between">
    <div>
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{page * instancesPerPage + 1}</span>
        to
        <span class="font-medium"
          >{Math.min(page * instancesPerPage + instancesPerPage, size)}</span
        >
        of
        <span class="font-medium">{size}</span>
        results
      </p>
    </div>
    <div>
      <nav
        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <p
          class="bg-white relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md border border-lightgrey text-sm font-medium text-gray-500 hover:bg-lightgrey"
          on:click={() => (page !== 0 ? page-- : "")}
        >
          <span class="sr-only">Previous</span>
          <!-- Heroicon name: solid/chevron-left -->
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </p>
        <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
        <p
          aria-current="page"
          class="z-10 bg-indigo-50 border-lightgrey text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white"
        >
          Page {page + 1} of {maxPage}
        </p>

        <p
          class="bg-white relative cursor-pointer inline-flex items-center px-2 py-2 rounded-r-md border border-lightgrey text-sm font-medium text-gray-500 hover:bg-lightgrey"
          on:click={() => (page < maxPage - 1 ? page++ : "")}
        >
          <span class="sr-only">Next</span>
          <!-- Heroicon name: solid/chevron-right -->
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </p>
      </nav>
    </div>
  </div>
</div>
