const htmlTemplate = `
  <li class="relative">
    <div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
      <img src="" alt="" class="station-logo pointer-events-none object-scale-down p-5 group-hover:opacity-75" title="">
      <button type="button" class="absolute inset-0 focus:outline-none">
        <span class="station-name-sr sr-only"></span>
      </button>
    </div>
    <p class="station-name pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900"></p>
   </li>
`

class Station extends HTMLElement {
  connectedCallback() {
    this.innerHTML = htmlTemplate
  }

  /**
   * Set the title and alt attributes of the station image
   * 
   * @param {string} name 
   */
  setStationName(name) {
    this.querySelector(".station-logo").setAttribute("alt", name)
    this.querySelector(".station-logo").setAttribute("title", name)
    this.querySelector(".station-name-sr").textContent = name
    this.querySelector(".station-name").textContent = name
  }

  /**
   * Set the URL of the station image
   * 
   * @param {string} src 
   */
  setStationImage(src) {
    this.querySelector(".station-logo").setAttribute("src", src)
  }

  /**
   * Mark a station as already played
   */
  setStationAsPlayed() {
    this.classList.add("opacity-30")
  }
}

customElements.define("cg-station", Station)