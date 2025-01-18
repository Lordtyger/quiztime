
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Papa from 'papaparse';
import type { FlashCardApiResponse } from '../../types/flashcards';
import { setCacheFlashCards } from '../flashcards/flashCardSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'data',
    prepareHeaders: (headers) => {
        headers.set('Accept', 'text/csv');  // Ensure the server returns CSV
        return headers;
    },
    responseHandler: 'text',
});
export const flashApiSlice = createApi({
    baseQuery,
    reducerPath: "flashApi",

    tagTypes: ["Flashcards"],
    endpoints: build => ({
        getFlash: build.query<FlashCardApiResponse, string>({
            query: (csvFileName) =>
                `flash/${csvFileName}.csv`,
            transformResponse: (response: string) => {
                const parsedData = {};
                // Parse the CSV response using PapaParse
                const tmp = response.split('Question,Answer').filter((item: unknown) => item && item !== '');

                tmp.forEach((topic: string) => {
                    
                    const itemPart = Papa.parse(topic,{delimiter: ','} ).data.filter((item: unknown): item is string[] => Array.isArray(item) && item?.[0] !== '');
                    console.log('itemPart', itemPart);
                    const key = itemPart[0]?.[0].replace(/ /g, '_').toLowerCase();
                    if (typeof key === 'string') {
                        (parsedData as Record<string, string[][]>)[key] = itemPart.slice(1);
                    }
                });

                return parsedData;
            },
            async onQueryStarted(csvFileName, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setCacheFlashCards({
                        key: csvFileName,
                        flashCards: data
                    }));
                } catch (err) {
                    console.error(err);
                }
            }, providesTags: () => [{ type: "Flashcards" }],
        }),
    }),
})

export const { useGetFlashQuery } = flashApiSlice
