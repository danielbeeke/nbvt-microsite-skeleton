module Jekyll
  module SpamSpanFilter
    def spamspan(input)
      input_exploded = input.split('@')

      output = '<span class="spamspan">
                <span class="u">' + input_exploded[0] + '</span>
                @
                <span class="d">' + input_exploded[1] + '</span>
                </span>'
      output
    end
  end
end

Liquid::Template.register_filter(Jekyll::SpamSpanFilter)