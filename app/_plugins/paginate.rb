module Jekyll

  class PaginatePage < Page
    def initialize(site, base, dir, paginate_items, layout, paginate_previous, paginate_next, pager_items)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), layout + '.html')

      self.data['paginate_items'] = paginate_items
      self.data['paginate_previous'] = paginate_previous
      self.data['paginate_next'] = paginate_next
      self.data['paginate_pager_items'] = pager_items

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

                     if index == 1
                        paginate_previous = '/' + collection['paginate_path'] + '/'
                     elsif index == 0
                     else
                        paginate_previous = '/' + collection['paginate_path'] + '/' + (index1 - 1).to_s
                     end

                     if index < groups.size - 1
                        paginate_next = '/' + collection['paginate_path'] + '/' + (index1 + 1).to_s
                     end

                     pager_items = []


if index1 - 3 < 1
    min = 1
else
    min = index1 - 3
end

for i in min..index1
    if i == 1
        item = Hash["number" => i, "link" => '/' + collection['paginate_path'] + '/']
    else
        item = Hash["number" => i, "link" => '/' + collection['paginate_path'] + '/' + (i).to_s + '/']
    end
    pager_items.push(item)
end

if index1 + 3 > groups.size
    max = groups.size
else
    max = index1 + 3
end

for i in index1+1..max
    if i == 1
        item = Hash["number" => i, "link" => '/' + collection['paginate_path'] + '/']
    else
        item = Hash["number" => i, "link" => '/' + collection['paginate_path'] + '/' + (i).to_s + '/']
    end
    pager_items.push(item)
end

                     site.pages << PaginatePage.new(site, site.source, File.join(collection['paginate_path'], file_name), group, name, paginate_previous, paginate_next, pager_items)

                  end

              end
         end

     end
  end

end