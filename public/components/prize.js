const htmlTemplate = `
<div class="relative overflow-hidden bg-gray-50 pt-16 sm:pt-24 lg:pt-32">
  <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
    <div>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Du hast gewonnen!</p>
      <p class="prize-name mx-auto mt-5 max-w-prose text-xl text-gray-500">Loading...</p>
    </div>
    <div class="my-12">
      <img class="prize-image object-contain rounded-lg shadow-xl ring-1 ring-black ring-opacity-5" src="" alt="" title="">
    </div>
  </div>
</div>

<img class="prize-image" src="" alt="" title="" />
<h3 class="prize-name"></h3>
`

class Prize extends HTMLElement {
  connectedCallback() {
    this.innerHTML = htmlTemplate
  }
  /**
   * Set the name and the attributes alt and title of prize
   * 
   * @param {string} name Name, alt and title of prize
   */
  setPrizeName(name) {
    this.querySelector(".prize-name").textContent = name
    this.querySelector(".prize-image").setAttribute("alt", name)
    this.querySelector(".prize-image").setAttribute("title", name)
  }

  /**
   * Set the image of prize
   *  
   * @param {string} src The URL of the image
   */
  setPrizeImage(src) {
    this.querySelector(".prize-image").setAttribute("src", src)
  }

  /**
   * Hide the prize image, useful if there is no src set
   */
  noPrize() {
    this.style.display = "none"
  }
}

customElements.define("cg-prize", Prize)