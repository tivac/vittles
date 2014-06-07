/*jshint node:true */

"use strict";

var xregexp = require("xregexp").XRegExp;

// TODO: lookbehind :(
module.exports = {
    filters : [
        /*
        // Show.Name.S01E02.S01E03.Source.Quality.Etc-Group
        // Show Name - S01E02 - S01E03 - S01E04 - Ep Name
        xregexp(
            "^(?P<series_name>.+?)[. _-]+" +                // Show_Name and separator
            "s(?P<season_num>\\d+)[. _-]*" +                // S01 and optional separator
            "e(?P<ep_num>\\d+)" +                           // E02 and separator
            "([. _-]+s(?P<season_num>)[. _-]*" +            // S01 and optional separator
            "e(?P<extra_ep_num>\\d+))+" +                   // E03/etc and separator
            "[. _-]*((?P<extra_info>.+?)" +                 // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                        // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",          // Group
            "i"
        ),
        
        // Show.Name.1x02.1x03.Source.Quality.Etc-Group
        // Show Name - 1x02 - 1x03 - 1x04 - Ep Name
        xregexp(
            "^(?P<series_name>.+?)[. _-]+" +                // Show_Name and separator
            "(?P<season_num>\\d+)x" +                       // 1x
            "(?P<ep_num>\\d+)" +                            // 02 and separator
            "([. _-]+(?P=season_num)x" +                    // 1x
            "(?P<extra_ep_num>\\d+))+" +                    // 03/etc and separator
            "[. _-]*((?P<extra_info>.+?)" +                 // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                        // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",          // Group
            "i"
        ),

        // Several sites doing this now, putting their url at the start for credit
        // (generally just in the torrent name, but also, sometimes in the dir and/or filenames)
        // This is the 'standard' regex, with allowance for this at the beginning.

        // [www.Cpasbien.me] 666.Park.Avenue.S01E13.Vostfr.HDTV.XviD-iTOMa
        // [ www.Torrenting.com ] - American.Idol.S12E35.480p.HDTV.x264-mSD
        // [ www.Torrenting.com ] - Game.of.Thrones.S03E06.HDTV.XviD-AFG
        // [ www.Torrenting.com ] - Men.at.Work.S02E06.HDTV.XviD-AFG
        // [kat.ph]666.park.avenue.s01e12.vostfr.hdtv.xvid.itoma
        xregexp(
            "^(\\[.+\\][ -]*)" +                            // likely a web address, surrounded by [ and ]
            "((?P<series_name>.+?)[. _-]+)?" +              // Show_Name and separator
            "s(?P<season_num>\\d+)[. _-]*" +                // S01 and optional separator
            "e(?P<ep_num>\\d+)" +                           // E02 and separator
            "(([. _-]*e|-)" +                               // linking e/- char
            "(?P<extra_ep_num>(?!(1080|720)[pi])\\d+))*" +  // additional E03/etc
            "[. _-]*((?P<extra_info>.+?)" +                 // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                        // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",          // Group
            "i"
        ),

        // Show.Name.S01E02.Source.Quality.Etc-Group
        // Show Name - S01E02 - My Ep Name
        // Show.Name.S01.E03.My.Ep.Name
        // Show.Name.S01E02E03.Source.Quality.Etc-Group
        // Show Name - S01E02-03 - My Ep Name
        // Show.Name.S01.E02.E03
        xregexp(
            "^((?P<series_name>.+?)[. _-]+)?" +             // Show_Name and separator
            "s(?P<season_num>\\d+)[. _-]*" +                // S01 and optional separator
            "e(?P<ep_num>\\d+)" +                           // E02 and separator
            "(([. _-]*e|-)" +                               // linking e/- char
            "(?P<extra_ep_num>(?!(1080|720)[pi])\\d+))*" +  // additional E03/etc
            "[. _-]*((?P<extra_info>.+?)" +                 // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                        // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",          // Group
            "i"
        ),

        // Show_Name.1x02.Source_Quality_Etc-Group
        // Show Name - 1x02 - My Ep Name
        // Show_Name.1x02x03x04.Source_Quality_Etc-Group
        // Show Name - 1x02-03-04 - My Ep Name
        xregexp(
            "^((?P<series_name>.+?)[\\[. _-]+)?" +          // Show_Name and separator
            "(?P<season_num>\\d+)x" +                       // 1x
            "(?P<ep_num>\\d+)" +                            // 02 and separator
            "(([. _-]*x|-)" +                               // linking x/- char
            "(?P<extra_ep_num>\n" +
            "(?!(1080|720)[pi])(?!(?<=x)264)" +             // ignore obviously wrong multi-eps
            "\\d+))*" +                                     // additional x03/etc
            "[\\]. _-]*((?P<extra_info>.+?)" +              // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                        // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",          // Group
            "i"
        ),

        // Show.Name.2010.11.23.Source.Quality.Etc-Group
        // Show Name - 2010-11-23 - Ep Name
        xregexp(
            "^((?P<series_name>.+?)[. _-]+)?" +             // Show_Name and separator
            "(?P<air_year>\\d{4})[. _-]+" +                 // 2010 and separator
            "(?P<air_month>\\d{2})[. _-]+" +                // 11 and separator
            "(?P<air_day>\\d{2})" +                         // 23 and separator
            "[. _-]*((?P<extra_info>.+?)" +                 // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                        // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",          // Group
            "i"
        ),

        // tpz-abc102
        xregexp(
            "(?P<release_group>.+?)-\\w+?[\\. ]?" +         // tpz-abc
            "(?!264)" +                                     // don't count x264
            "(?P<season_num>\\d{1,2})" +                    // 1
            "(?P<ep_num>\\d{2})$",                          // 02
            "i"
        ),

        // Show Name Season 1 Episode 2 Ep Name
        xregexp(
            "^(?P<series_name>.+?)[. _-]+" +                // Show Name and separator
            "season[. _-]+" +                               // season and separator
            "(?P<season_num>\\d+)[. _-]+" +                 // 1
            "episode[. _-]+" +                              // episode and separator
            "(?P<ep_num>\\d+)[. _-]+" +                     // 02 and separator
            "(?P<extra_info>.+)$",                          // Source_Quality_Etc-
            "i"
        ),

        // Show.Name.E02-03
        // Show.Name.E02.2010
        xregexp(
            "^((?P<series_name>.+?)[. _-]+)?" +                            // Show_Name and separator
            "(e(p(isode)?)?|part|pt)[. _-]?" +                             // e, ep, episode, or part
            "(?P<ep_num>(\\d+|[ivx]+))" +                                  // first ep num
            "((([. _-]+(and|&|to)[. _-]+)|-)" +                            // and/&/to joiner
            "(?P<extra_ep_num>(?!(1080|720)[pi])(\\d+|[ivx]+))[. _-])" +   // second ep num
            "([. _-]*(?P<extra_info>.+?)" +                                // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                                       // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",                         // Group
            "i"
        ),

        // Show.Name.E23.Test
        // Show.Name.Part.3.Source.Quality.Etc-Group
        // Show.Name.Part.1.and.Part.2.Blah-Group
        xregexp(
            "^((?P<series_name>.+?)[. _-]+)?" +             // Show_Name and separator
            "(e(p(isode)?)?|part|pt)[. _-]?" +              // e, ep, episode, or part
            "(?P<ep_num>(\\d+|([ivx]+(?=[. _-]))))" +       // first ep num
            "([. _-]+((and|&|to)[. _-]+)?" +                // and/&/to joiner
            "((e(p(isode)?)?|part|pt)[. _-]?)" +            // e, ep, episode, or part
            "(?P<extra_ep_num>(?!(1080|720)[pi])\n" +
            "(\\d+|([ivx]+(?=[. _-]))))[. _-])*" +          // second ep num
            "([. _-]*(?P<extra_info>.+?)" +                 // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                        // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",          // Group
            "i"
        ),

        // Show.Name.102.Source.Quality.Etc-Group
        xregexp(
            "^(?P<series_name>.+?)[. _-]+" +                   // Show_Name and separator
            "(?P<season_num>\\d{1,2})" +                       // 1
            "(?P<ep_num>\\d{2})" +                             // 02 and separator
            "([. _-]+(?P<extra_info>(?!\\d{3}[. _-]+)[^-]+)" + // Source_Quality_Etc-
            "([ -]+(?P<release_group>.+))?)?$",                // Group
            "i"
        ),

        // Show Name - 01 - Ep Name
        // 01 - Ep Name
        // 01 - Ep Name
        xregexp(
            "^((?P<series_name>.+?)(?:[. _-]{2,}|[. _]))?" +   // Show_Name and separator
            "(?P<ep_num>\\d{1,2})" +                           // 02
            "(?:-(?P<extra_ep_num>\\d{1,2}))*" +               // 02
            "[. _-]+((?P<extra_info>.+?)" +                    // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                           // Make sure this is really the release group
            "[ -]+(?P<release_group>[^- ]+))?)?$",             // Group
            "i"
        ),

        // BBC Lost Kingdoms of South America 3of4 Lands of Gold PDTV x264 AC3mp4-MVGroup
        // BBC.Great.British.Railway.Journeys.Series4.03of25.Stoke-on-Trent.to.Winsford.720p.HDTV.x264.AAC.MVGroup
        xregexp(
            "^(?P<series_name>.+?)[. _-]+" +                   // Show_Name and separator
            "((series|season)(?P<season_num>\\d+)[. _-]+)?" +  // Series4
            "(?P<ep_num>\\d{1,2})of\\d{1,2}" +                 // 3of4
            "[. _-]+((?P<extra_info>.+?)" +                    // Source_Quality_Etc-
            "((?<![. _-])(?<!WEB)" +                           //   Make sure this is really the release group
            "-(?P<release_group>[^- ]+))?)?$",                 // Group
            "i"
        )*/
    ],
    
    rejects : [
        "sub(pack|s|bed)",
        "nlsub(bed|s)?",
        "swesub(bed)?",
        "(dir|sample|sub|nfo)fix",
        "sample",
        "(dvd)?extras",
        "dub(bed)?",
        "german",
        "french",
        "core2hd",
        "dutch",
        "swedish",
        "subtitulado"
    ].map(function(pattern) {
        return new RegExp("(^|[\\W_])\n" + pattern + "($|[\\W_])", "i");
    })
};
