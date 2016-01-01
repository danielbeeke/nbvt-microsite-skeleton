module Jekyll

  class PagesPageGenerator < Generator
     safe true
     priority :highest

     def generate(site)

          pages = site.collections['pages'].docs

          pages.each do |page|

            dest = page.destination(site.dest)

            unless File.file?(dest)

                puts 'wrote ' + dest

                # page.write(dest)

            end

          end

     end
  end

end