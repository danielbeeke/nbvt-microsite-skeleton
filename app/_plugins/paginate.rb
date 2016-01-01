module Jekyll

  class PaginatePage < Page
    def initialize(site, base, dir, paginate_items)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'news.html')

      self.data['paginate_items'] = paginate_items
    end
  end

  class PaginatePageGenerator < Generator
     safe true

     def generate(site)
         dir = 'test'
         groups = site.collections['news'].docs.each_slice(3).to_a

         groups.each_with_index do |group, index|

            if index != 0
                file_name = index.to_s
            else
                file_name = ''
            end

            site.pages << PaginatePage.new(site, site.source, File.join(dir, file_name), group)

         end

     end
  end

end