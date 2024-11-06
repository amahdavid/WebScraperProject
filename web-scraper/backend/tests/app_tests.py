import pytest # type: ignore
from backend import app

@pytest.fixture
def client():
    test_app = app()
    test_app.config['TESTING'] = True
    with test_app.test_client() as client:
        yield client

def test_scraping_function(client):
    response = client.post('http://127.0.0.1:5000/scrape', json={'url': 'http://example.com'})
    assert response.status_code == 200
    assert 'expected_data' in response.json
