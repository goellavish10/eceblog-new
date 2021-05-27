const moment = require('moment')

module.exports = {
  formatDate: (date, format)=>{
    return moment(date).utcOffset("+05:30").format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  deleteComment: function (loggedUser, commentorName, id, comment, floating = true) {
    if (loggedUser.toString() === commentorName.toString()) {
      if (floating) {
        
        return `<form action="/stories/${id}/${commentorName}/${comment}" method="POST">
                    <button type="submit" class="btn red">
                        <i class="fas fa-trash fa-small"></i>
                    </button>
                </form>`
      } else {
        return `<form action="/stories/${id}/${commentorName}/${comment}" method="POST">
                    <button type="submit" class="btn red">
                        <i class="fas fa-trash"></i>
                    </button>
                </form>`
      }
    } else {
      return ''
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
  checkingCurrentPagePublic: function (currentPage, pages) {
    let current = parseInt(currentPage)
    let total = parseInt(pages)
    if (current == 1 && total > 1) {
      return `<div class="row" style="margin-bottom: 3rem;">
      <div class="col s12 right-align"><a 
            href="/?page=${parseInt(currentPage) + 1}" class="btn"> <span>
              Page ${parseInt(currentPage) + 1}
              <i class="fas fa-chevron-right"></i>
            </span>
            </a></div>
      
  </div>`
    } else if (current < total) {
      return `<div class="row" style="margin-bottom: 3rem;">
      <div class="col s6"><a 
            href="/?page=${parseInt(currentPage) - 1}" class="btn"> <span>
              <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
            </span>
            </a>
          </div>
      <div class="col s6 right-align"><a 
            href="/?page=${parseInt(currentPage) + 1}" class="btn"> <span>
              Page ${parseInt(currentPage) + 1}
              <i class="fas fa-chevron-right"></i>
            </span>
            </a></div>
      
  </div>`
    } else if (current == total && total > 1) {
      return `<div class="row" style="margin-bottom: 3rem;">
      <div class="col s12 left-align"><a 
            href="/?page=${parseInt(currentPage) - 1}" class="btn"> <span>
              <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
            </span>
            </a>
          </div>
          </div>`
    }
  },
  checkingCurrentPage: function (currentPage, pages) {
    let current = parseInt(currentPage)
    let total = parseInt(pages)
    if (current == 1 && total > 1) {
      return `<div class="row" style="margin-bottom: 3rem;">
      <div class="col s12 right-align"><a 
            href="/stories?page=${parseInt(currentPage) + 1}" class="btn"> <span>
              Page ${parseInt(currentPage) + 1}
              <i class="fas fa-chevron-right"></i>
            </span>
            </a></div>
      
  </div>`
    } else if (current < total) {
      return `<div class="row" style="margin-bottom: 3rem;">
      <div class="col s6"><a 
            href="/stories?page=${parseInt(currentPage) - 1}" class="btn"> <span>
              <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
            </span>
            </a>
          </div>
      <div class="col s6 right-align"><a 
            href="/stories?page=${parseInt(currentPage) + 1}" class="btn"> <span>
              Page ${parseInt(currentPage) + 1}
              <i class="fas fa-chevron-right"></i>
            </span>
            </a></div>
      
  </div>`
    } else if (current == total && total > 1) {
      return `<div class="row" style="margin-bottom: 3rem;">
      <div class="col s12 left-align"><a 
            href="/stories?page=${parseInt(currentPage) - 1}" class="btn"> <span>
              <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
            </span>
            </a>
          </div>
          </div>`
    }
  },
}
