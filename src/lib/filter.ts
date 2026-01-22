import { NextRequest } from "next/server";
export const getFilters = (request: NextRequest) => {
  const filters: Record<string, any> = {};
  for (const [key, value] of  request.nextUrl.searchParams.entries()){
    const match = key.match(/^filter\[(.+)\]$/)
    if(match){
        filters[match[1]] = value
    }
  }
  return filters;
};
