const key = '55a59914b837cf3472a26f06a898ec1a'
const user_id = '154269812@N04'

function get (method, params, callback) {

  let url = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1'
  url += '&api_key=' + key
  url += '&method=' + method


  if (params) {
    Object.keys(params).forEach(function(key) {
      url += '&' + key + '=' + params[key]
    })
  }
  const request = new XMLHttpRequest()
  request.onload = function(event) {
    callback(JSON.parse(event.target.responseText))
  }
  request.open('GET', url)
  request.send()
}


const app = new Vue({
  el: "#app",
  created() {
    if (window.location.host.substr(0, 9) !== 'localhost') {
      this.getPhotos()
    }

  },
  data() {
    return {
      style: "feed",
      page: 1,
      loading: false,
      showFilters: false,
      filters: {
        place: '',
        year: '',
        text: '',
        tag: '',
        sort: 'date-taken-desc',
      },
      photos: JSON.parse(localStorage.getItem('photos') || '[]'),
    }
  },
  methods: {
    getPhotos(event) {
      this.loading = true
      const defaultParams = {
        user_id: user_id,
        extras: 'views,url_sq,url_t,url_s,url_q,url_m,url_l,geo,tags,description,date_taken,machine_tags'
      }
      const params = Object.assign({}, defaultParams, this.getFilters())
      const vm = this
      get("flickr.photos.search", params, function(data) {
        vm.photos = data.photos.photo
        localStorage.setItem('photos', JSON.stringify(vm.photos))
        vm.loading = false
      })
    },
    getEXIF(photo) {
      if (photo.exif) {
        Vue.set(photo, 'showData', !photo.showData)
        return
      }
      const params = {
        photo_id: photo.id,
      }
      this.loading = true
      const vm = this
      get('flickr.photos.getExif', params, function(data) {
        Vue.set(photo, 'exif', data.photo)
        Vue.set(photo, 'showData', true)
        vm.loading = false
      })
    },
    toggleShowData(photo) {
      const shown = photo.showData || false
      Vue.set(photo, 'showData', !shown)
    },
    getPhotoTags(photo) {
      if (!photo.tags) return []
      return photo.tags.split(' ')
    },
    getFilters() {
      // todo: work out min_taken_date, max_taken_date based on selected year
      const filters = {}
      const text = this.filters.text
      const sort = this.filters.sort
      const tag = this.filters.tag

      if (text) {
        filters.text = text
      }

      if (sort) {
        filters.sort = sort
      }

      if (tag) {
        filters.tags = tag // note the plural
      }
      return filters

    },
    getImageSrc(photo) {
      if (this.style === 'feed') {
        return photo.url_l
      }
      return photo.url_s
    }
  }

})