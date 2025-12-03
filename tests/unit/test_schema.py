"""
Unit tests for Pydantic schema validation (white-box testing)
Testing data validation in schema.py
"""
import sys
import os

# Add project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pydantic import ValidationError
from backend.schema import (
    Message, PropertyRequest, PropertyResponse, 
    PropertiesList, PropertyUpdateRequest
)
from backend.model import NumBedrooms


class TestSchemaValidation:
    """Unit tests for schema validation logic"""
    
    def test_message_schema(self):
        """Test Message schema for API responses"""
        print("✅ Test: Message schema")
        
        # Valid message
        msg = Message(message="Operation successful")
        assert msg.message == "Operation successful"
        print(f"   ✓ Message: '{msg.message}'")
        
        # Test JSON serialization
        json_data = msg.model_dump()
        assert json_data == {"message": "Operation successful"}
        print(f"   ✓ JSON serialization: {json_data}")
    
    def test_property_request_validation(self):
        """Test PropertyRequest schema validation"""
        print("\n✅ Test: PropertyRequest schema validation")
        
        # Valid data
        valid_data = {
            "description": "Luxury apartment with sea view",
            "number_bedrooms": "T2",
            "price": 2500.0,
            "area": 120.5,
            "location": "Lisbon, Portugal"
        }
        
        request = PropertyRequest(**valid_data)
        assert request.description == valid_data["description"]
        assert request.number_bedrooms == NumBedrooms.t2
        assert request.price == 2500.0
        assert request.area == 120.5
        assert request.location == "Lisbon, Portugal"
        print(f"   ✓ Valid PropertyRequest created: {request}")
    
    def test_property_request_invalid_bedrooms(self):
        """Test invalid number_bedrooms validation"""
        print("\n✅ Test: Invalid number_bedrooms validation")
        
        invalid_data = {
            "description": "Test property",
            "number_bedrooms": "INVALID",  # Not in NumBedrooms enum
            "price": 1000.0,
            "area": 50.0,
            "location": "Test"
        }
        
        try:
            PropertyRequest(**invalid_data)
            assert False, "Should have raised ValidationError"
        except ValidationError as e:
            error_msg = str(e.errors()[0]['msg'])
            assert "Input should be" in error_msg or "Invalid enum" in error_msg
            print(f"   ✓ Correctly rejected invalid number_bedrooms")
            print(f"   ✓ Error: {error_msg}")
    
    def test_property_request_numeric_validation(self):
        """Test numeric field validation (actual behavior)"""
        print("\n✅ Test: Numeric field validation (Actual Schema Behavior)")
        
        # Test negative price - ACTUALLY ALLOWED by schema
        negative_price_data = {
            "description": "Test Property with Negative Price",
            "number_bedrooms": "T1",
            "price": -100.0,  # Negative price - schema allows this!
            "area": 50.0,
            "location": "Test Location"
        }
        
        # This should work since schema doesn't validate min value
        request = PropertyRequest(**negative_price_data)
        assert request.price == -100.0
        print(f"   ⚠️  Negative price accepted: €{request.price}")
        print(f"   Note: Schema doesn't validate min price value")
        
        # Test zero area - ACTUALLY ALLOWED by schema
        zero_area_data = {
            "description": "Test Property with Zero Area",
            "number_bedrooms": "T1",
            "price": 1000.0,
            "area": 0.0,  # Zero area - schema allows this!
            "location": "Test Location"
        }
        
        request = PropertyRequest(**zero_area_data)
        assert request.area == 0.0
        print(f"   ⚠️  Zero area accepted: {request.area}m²")
        print(f"   Note: Schema doesn't validate min area value")
        
        # Test very large values
        large_value_data = {
            "description": "Test Property with Large Values",
            "number_bedrooms": "T3",
            "price": 9999999.99,  # Very large price
            "area": 10000.0,      # Very large area
            "location": "Test"
        }
        
        request = PropertyRequest(**large_value_data)
        assert request.price == 9999999.99
        assert request.area == 10000.0
        print(f"   ✓ Large values accepted: €{request.price}, {request.area}m²")
    
    def test_property_response_inheritance(self):
        """Test PropertyResponse extends PropertyRequest with ID"""
        print("\n✅ Test: PropertyResponse schema (inheritance)")
        
        data = {
            "id": 42,
            "description": "Beach house",
            "number_bedrooms": "T3",
            "price": 3500.0,
            "area": 180.0,
            "location": "Algarve"
        }
        
        response = PropertyResponse(**data)
        
        # Should have all PropertyRequest fields
        assert response.description == "Beach house"
        assert response.number_bedrooms == NumBedrooms.t3
        assert response.price == 3500.0
        assert response.area == 180.0
        assert response.location == "Algarve"
        
        # Plus the ID field
        assert response.id == 42
        
        print(f"   ✓ PropertyResponse includes ID: {response.id}")
        print(f"   ✓ Inherits all PropertyRequest fields")
    
    def test_properties_list_schema(self):
        """Test PropertiesList schema for list responses"""
        print("\n✅ Test: PropertiesList schema")
        
        # Create sample properties
        properties = [
            {
                "id": 1,
                "description": "Apartment 1",
                "number_bedrooms": "T1",
                "price": 1000.0,
                "area": 50.0,
                "location": "City 1"
            },
            {
                "id": 2,
                "description": "Apartment 2",
                "number_bedrooms": "T2",
                "price": 1500.0,
                "area": 75.0,
                "location": "City 2"
            }
        ]
        
        # Create PropertyResponse objects
        property_responses = [PropertyResponse(**prop) for prop in properties]
        
        # Create PropertiesList
        properties_list = PropertiesList(properties=property_responses)
        
        assert len(properties_list.properties) == 2
        assert properties_list.properties[0].id == 1
        assert properties_list.properties[1].id == 2
        
        print(f"   ✓ PropertiesList contains {len(properties_list.properties)} properties")
        print(f"   ✓ First property ID: {properties_list.properties[0].id}")
        print(f"   ✓ Second property ID: {properties_list.properties[1].id}")
    
    def test_property_update_request_optional_fields(self):
        """Test PropertyUpdateRequest allows partial updates"""
        print("\n✅ Test: PropertyUpdateRequest (partial updates)")
        
        # Test with only description
        update1 = PropertyUpdateRequest(description="Updated description")
        assert update1.description == "Updated description"
        assert update1.number_bedrooms is None
        assert update1.price is None
        assert update1.area is None
        assert update1.location is None
        print(f"   ✓ Partial update with only description works")
        
        # Test with multiple fields
        update2 = PropertyUpdateRequest(
            price=2000.0,
            location="New Location"
        )
        assert update2.price == 2000.0
        assert update2.location == "New Location"
        assert update2.description is None
        print(f"   ✓ Partial update with price and location works")
        
        # Test with all fields (also valid)
        update3 = PropertyUpdateRequest(
            description="Fully updated",
            number_bedrooms="T3",
            price=3000.0,
            area=100.0,
            location="Premium Location"
        )
        assert update3.description == "Fully updated"
        assert update3.number_bedrooms == NumBedrooms.t3
        assert update3.price == 3000.0
        assert update3.area == 100.0
        assert update3.location == "Premium Location"
        print(f"   ✓ Full update with all fields works")
    
    def test_edge_case_validations(self):
        """Test edge cases in schema validation"""
        print("\n✅ Test: Edge case validations")
        
        # Test empty strings (allowed by schema)
        empty_string_data = {
            "description": "",  # Empty string
            "number_bedrooms": "T1",
            "price": 1000.0,
            "area": 50.0,
            "location": ""  # Empty string
        }
        
        request = PropertyRequest(**empty_string_data)
        assert request.description == ""
        assert request.location == ""
        print(f"   ⚠️  Empty strings accepted for description and location")
        
        # Test whitespace-only strings
        whitespace_data = {
            "description": "   ",  # Only spaces
            "number_bedrooms": "T2",
            "price": 1500.0,
            "area": 75.0,
            "location": "  \t\n  "  # Whitespace
        }
        
        request = PropertyRequest(**whitespace_data)
        assert request.description == "   "
        assert request.location == "  \t\n  "
        print(f"   ⚠️  Whitespace-only strings accepted")
        
        print(f"   Note: Schema doesn't validate string content")


def test_schema_field_types():
    """Test field type annotations in schemas"""
    print("\n✅ Test: Schema field type annotations")
    
    # Check PropertyRequest field types
    fields = PropertyRequest.model_fields
    
    expected_types = {
        'description': str,
        'number_bedrooms': NumBedrooms,
        'price': float,
        'area': float,
        'location': str
    }
    
    for field_name, expected_type in expected_types.items():
        actual_type = fields[field_name].annotation
        assert actual_type == expected_type, \
            f"{field_name} should be {expected_type}, got {actual_type}"
        print(f"   ✓ {field_name}: {actual_type.__name__}")
    
    # Check PropertyResponse adds id field
    response_fields = PropertyResponse.model_fields
    assert 'id' in response_fields
    assert response_fields['id'].annotation == int
    print(f"   ✓ PropertyResponse adds: id: int")
    
    # Check PropertyUpdateRequest optional types
    update_fields = PropertyUpdateRequest.model_fields
    for field_name in ['description', 'location']:
        field_type = str(update_fields[field_name].annotation)
        assert 'None' in field_type or 'Optional' in field_type
        print(f"   ✓ PropertyUpdateRequest.{field_name}: Optional[str]")
    
    for field_name in ['price', 'area']:
        field_type = str(update_fields[field_name].annotation)
        assert 'None' in field_type or 'Optional' in field_type
        print(f"   ✓ PropertyUpdateRequest.{field_name}: Optional[float]")


def test_schema_limitations():
    """Document schema limitations found during testing"""
    print("\n🔍 Test: Schema Limitations (For Documentation)")
    
    limitations = [
        "1. No minimum value validation for price (negative values allowed)",
        "2. No minimum value validation for area (zero/negative values allowed)",
        "3. No string length validation (empty strings allowed)",
        "4. No string content validation (whitespace-only strings allowed)",
        "5. No maximum value validation for numeric fields",
        "6. No format validation for location field"
    ]
    
    print("   Schema validation limitations identified:")
    for limitation in limitations:
        print(f"   ⚠️  {limitation}")
    
    print("\n   Recommendation for improvement:")
    print("   - Add Field(gt=0) for price and area")
    print("   - Add Field(min_length=1) for string fields")
    print("   - Add Field(max_length=255) for description/location")


if __name__ == "__main__":
    print("=" * 60)
    print("UNIT TESTS: SCHEMA VALIDATION (White-Box Testing)")
    print("=" * 60)
    print()
    
    # Run schema tests
    schema_tests = TestSchemaValidation()
    
    schema_tests.test_message_schema()
    print()
    
    schema_tests.test_property_request_validation()
    print()
    
    schema_tests.test_property_request_invalid_bedrooms()
    print()
    
    schema_tests.test_property_request_numeric_validation()
    print()
    
    schema_tests.test_property_response_inheritance()
    print()
    
    schema_tests.test_properties_list_schema()
    print()
    
    schema_tests.test_property_update_request_optional_fields()
    print()
    
    schema_tests.test_edge_case_validations()
    print()
    
    test_schema_field_types()
    print()
    
    test_schema_limitations()
    
    print()
    print("=" * 60)
    print("✅ ALL SCHEMA UNIT TESTS PASSED!")
    print("=" * 60)
    print("\n📊 Test Summary:")
    print("   1. ✅ Message schema for API responses")
    print("   2. ✅ PropertyRequest validation with enum")
    print("   3. ✅ PropertyResponse inheritance with ID")
    print("   4. ✅ PropertiesList for list responses")
    print("   5. ✅ PropertyUpdateRequest for partial updates")
    print("   6. ✅ Field type annotations correct")
    print("   7. 🔍 Schema limitations documented")
    print("\n💡 White-Box Testing Insight:")
    print("   - Tests reveal actual schema behavior, not just expected")
    print("   - Found validation gaps (negative prices, empty strings)")
    print("   - Provides documentation for potential improvements")