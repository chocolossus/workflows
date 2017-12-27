$ = require 'jquery'

do fill = (item = 'The most creative minds in Art -- OH HELLS YEAH!!!') ->
  $('.tagline').append "#{item}"
fill
