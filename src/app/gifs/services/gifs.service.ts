import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';


const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem('gifsHistory') ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
}

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private http = inject(HttpClient);

  tredingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(false);

  private trendingPage = signal(0);

  trendingGridGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.tredingGifs().length; i += 3) {
      groups.push(this.tredingGifs().slice(i, i + 3));
    }
    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {

    this.loadTrendingGifs();

   }

   saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('gifsHistory', historyString);
   });

  loadTrendingGifs() {

    if(this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${ environment.giphyApiUrl }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '20',
        offset: this.trendingPage() * 20,
      },
    }).subscribe((response) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
      this.tredingGifs.update(currentGifs => [
        ...currentGifs,
        ...gifs,
      ]);
      this.trendingPage.update( currentPage => currentPage + 1 );
      this.trendingGifsLoading.set(false);
    });
  }

  searchGifs(query: string):Observable<Gif[]> {

    this.trendingGifsLoading.set(true);
    return this.http.get<GiphyResponse>(`${ environment.giphyApiUrl }/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: '20',
      },
    }).pipe(
      map( ({ data }) => data ),
      map( (items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap( items => {
        this.searchHistory.update( history => ({
          ...history,
          [query.toLocaleLowerCase()]: items,
        }));
      })
    );
    // .subscribe((response) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
    //   console.log({gifs});

    // });
  }

  getHistoryGifs(query: string):Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
