module Jekyll

  class PaginatePage < Page
    def initialize(site, base, dir, paginate_items, layout)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), layout + '.html')

      self.data['paginate_items'] = paginate_items

    end
  end

  class PaginatePageGenerator < Generator
     safe true

     def generate(site)

         collections = site.config['collections']

         collections.each do |name, collection|

              if collection['paginate']

                  groups = site.collections[name].docs.each_slice(2).to_a

                  groups.each_with_index do |group, index|

                    index1 = index + 1

                     if index != 0
                         file_name = index1.to_s
                     else
                         file_name = ''
                     end

                     site.pages << PaginatePage.new(site, site.source, File.join(collection['paginate_path'], file_name), group, name)

                  end

              end
         end

     end
  end

end