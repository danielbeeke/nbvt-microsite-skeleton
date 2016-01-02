module Jekyll
  module TrimFilter
    def trim(input)
      input.to_s.strip
    end
  end
end

Liquid::Template.register_filter(Jekyll::TrimFilter)
