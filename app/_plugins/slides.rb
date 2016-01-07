module Jekyll

  class SlidePage < Page
    def initialize(site, base, dir, slide)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'slides.html')


      self.data['title'] = slide['title']
      self.data['slide'] = slide
    end
  end

  class SlidesPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'slides'
        dir = 'voordelen'

        result = File.read( 'app/_data/slides.json' )
        slides = JSON.parse( result )

        slides.each do |slide|
          site.pages << SlidePage.new(site, site.source, File.join(dir, slide['title'].split(' ').join('-').downcase), slide)
        end

      end
    end
  end

end