import React, { useState, useEffect, useCallback } from 'react';
import JoblyApi from '../api/api';
import CompanyCard from './CompanyCard';
import SearchForm from './SearchForm';
import LoadingSpinner from './LoadingSpinner';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const search = useCallback(async (name) => {
    setIsLoading(true);
    try {
      let companies = await JoblyApi.getCompanies(name);
      setCompanies(companies);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    search();
  }, [search]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="CompanyList col-md-8 offset-md-2">
      <SearchForm searchFor={search} />
      {companies.length ? (
        <div className="CompanyList-list">
          {companies.map(company => (
            <CompanyCard
              key={company.handle}
              handle={company.handle}
              name={company.name}
              description={company.description}
              logoUrl={company.logoUrl}
            />
          ))}
        </div>
      ) : (
        <p className="lead">Sorry, no results were found!</p>
      )}
    </div>
  );
}

export default CompanyList;